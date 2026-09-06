import { useChatContext } from 'stream-chat-expo';
import { useAuth } from '~/contexts/AuthProvider';


export function useStartDirectMessage() {
    const { client } = useChatContext();
    const { user: me } = useAuth();

    const startDirectMessage = async (otherUserId: string) => {
        const channel = client.channel('messaging', {members: [me.id, otherUserId]});
        await channel.watch();
        return channel.cid;
    }

    return { startDirectMessage }
}