// Edge Function: quản lý tài khoản người dùng (chỉ admin / super_admin).
// Dùng service_role (server-side) nên KHÔNG bao giờ lộ ra frontend.
// Phân quyền:
//   - super_admin: tạo/sửa/xóa mọi role (staff, admin, super_admin)
//   - admin: chỉ quản lý staff
import { createClient } from 'npm:@supabase/supabase-js@2'

const USERNAME_DOMAIN = 'users.thimut.local'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type Role = 'super_admin' | 'admin' | 'staff'

function emailForUsername(username: string) {
  return `${username.trim().toLowerCase()}@${USERNAME_DOMAIN}`
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const authHeader = req.headers.get('Authorization') ?? ''

    // Xác định người gọi từ JWT
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser()
    if (userErr || !user) return json({ error: 'Chưa đăng nhập' }, 401)

    const admin = createClient(url, serviceKey)

    const { data: caller } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    const callerRole = caller?.role as Role | undefined
    if (callerRole !== 'admin' && callerRole !== 'super_admin') {
      return json({ error: 'Bạn không có quyền quản lý tài khoản' }, 403)
    }

    // super_admin quản lý mọi role; admin chỉ quản lý staff
    const canManageRole = (role: Role) =>
      callerRole === 'super_admin' ? true : role === 'staff'

    const body = await req.json()
    const action = String(body.action ?? '')

    if (action === 'create') {
      const username = String(body.username ?? '')
        .trim()
        .toLowerCase()
      const password = String(body.password ?? '')
      const role = (body.role ?? 'staff') as Role
      const fullName = body.full_name ? String(body.full_name).trim() : null

      if (!/^[a-z0-9._-]{3,}$/.test(username)) {
        return json(
          { error: 'Username tối thiểu 3 ký tự (a-z, 0-9, . _ -)' },
          400,
        )
      }
      if (password.length < 6) {
        return json({ error: 'Mật khẩu tối thiểu 6 ký tự' }, 400)
      }
      if (!canManageRole(role)) {
        return json({ error: 'Bạn không được tạo tài khoản role này' }, 403)
      }

      const { data: created, error: createErr } =
        await admin.auth.admin.createUser({
          email: emailForUsername(username),
          password,
          email_confirm: true,
          user_metadata: { username, full_name: fullName },
        })
      if (createErr || !created.user) {
        return json(
          { error: createErr?.message ?? 'Tạo tài khoản thất bại' },
          400,
        )
      }

      const { error: profErr } = await admin.from('profiles').insert({
        id: created.user.id,
        username,
        full_name: fullName,
        role,
      })
      if (profErr) {
        // rollback auth user nếu tạo profile lỗi (vd: trùng username)
        await admin.auth.admin.deleteUser(created.user.id)
        const msg = profErr.message.includes('duplicate')
          ? 'Username đã tồn tại'
          : profErr.message
        return json({ error: msg }, 400)
      }
      return json({ ok: true, id: created.user.id })
    }

    if (action === 'update') {
      const id = String(body.id ?? '')
      if (!id) return json({ error: 'Thiếu id' }, 400)

      const { data: target } = await admin
        .from('profiles')
        .select('role')
        .eq('id', id)
        .single()
      const targetRole = target?.role as Role | undefined
      if (!targetRole) return json({ error: 'Tài khoản không tồn tại' }, 404)
      if (!canManageRole(targetRole)) {
        return json({ error: 'Bạn không có quyền sửa tài khoản này' }, 403)
      }

      const updates: Record<string, unknown> = {}
      if (body.full_name !== undefined) {
        updates.full_name = body.full_name
          ? String(body.full_name).trim()
          : null
      }
      if (body.role) {
        const newRole = body.role as Role
        if (!canManageRole(newRole)) {
          return json({ error: 'Bạn không được gán role này' }, 403)
        }
        updates.role = newRole
      }
      if (Object.keys(updates).length) {
        const { error } = await admin
          .from('profiles')
          .update(updates)
          .eq('id', id)
        if (error) return json({ error: error.message }, 400)
      }

      if (body.password) {
        if (String(body.password).length < 6) {
          return json({ error: 'Mật khẩu tối thiểu 6 ký tự' }, 400)
        }
        const { error } = await admin.auth.admin.updateUserById(id, {
          password: String(body.password),
        })
        if (error) return json({ error: error.message }, 400)
      }
      return json({ ok: true })
    }

    if (action === 'delete') {
      const id = String(body.id ?? '')
      if (!id) return json({ error: 'Thiếu id' }, 400)
      if (id === user.id) {
        return json({ error: 'Không thể tự xóa chính mình' }, 400)
      }
      const { data: target } = await admin
        .from('profiles')
        .select('role')
        .eq('id', id)
        .single()
      const targetRole = target?.role as Role | undefined
      if (!targetRole) return json({ error: 'Tài khoản không tồn tại' }, 404)
      if (!canManageRole(targetRole)) {
        return json({ error: 'Bạn không có quyền xóa tài khoản này' }, 403)
      }
      const { error } = await admin.auth.admin.deleteUser(id)
      if (error) return json({ error: error.message }, 400)
      return json({ ok: true })
    }

    return json({ error: 'Action không hợp lệ' }, 400)
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500)
  }
})
