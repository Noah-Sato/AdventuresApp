import { useChannelPreviewDisplayAvatar } from 'stream-chat-expo';
import { UserIcon } from '@components/userIcons';

export function ChannelPreviewAvatar({ channel }) {
    const displayAvatar = useChannelPreviewDisplayAvatar(channel);
    return <UserIcon userImage={displayAvatar.image} size={'small'} />;
}
