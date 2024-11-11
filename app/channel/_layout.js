import { Stack } from "expo-router";
import { ChatProvider } from "stream-chat-expo";




export default function ChannelStack() {

    return(
        <ChatProvider>
            <Stack>
                <Stack.Screen name='[cid]' options={{ headerShown: false }}/>
            </Stack>
        </ChatProvider>
    )
}