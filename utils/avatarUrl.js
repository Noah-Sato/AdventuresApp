import { supabase } from '~/utils/supabase'

export function getAvatarPublicUrl(avatarPathOrUrl) {
    if (!avatarPathOrUrl) return avatarPathOrUrl;
    if (/^https?:\/\//i.test(avatarPathOrUrl)) return avatarPathOrUrl;
    return  supabase.storage.from('avatars').getPublicUrl(avatarPathOrUrl).data.publicUrl;
}
