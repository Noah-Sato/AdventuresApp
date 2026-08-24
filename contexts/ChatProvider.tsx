import { PropsWithChildren, useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";


import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuth } from "./AuthProvider";
import { tokenProvider } from "~/utils/tokenProvider";


const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);


export default function ChatProvider({children}: PropsWithChildren) {

    const [isReady, setIsReady] = useState(false)
    const { profile, isAuthenticated } = useAuth();

    useEffect(()=>{
        if (!profile) {
            if (client.userID) {
                client.disconnectUser();
            }
            setIsReady(false);
            return;
        }

        let cancelled = false;
        setIsReady(false);

        const connect = async () => {
          if (client.userID) {
            await client.disconnectUser();
          }
          await client.connectUser(
            {
              id: profile.id,
              name: profile.full_name,
              image: profile.avatar_url,
            },
            tokenProvider
          );
          if (!cancelled) {
            setIsReady(true)
          }
        }
        connect();
        return() => {
            cancelled = true;
        };
      },[profile?.id])

      // Not logged in yet -- (auth) screens don't need chat, render them directly rather
      // than blocking on a connection that will never happen without a profile.
      if (!isAuthenticated) {
        return <>{children}</>
      }

      if (!isReady) {
        return(
            <View style={{flex:1, alignItems:'center'}}>
             <ActivityIndicator/>
             </View>
            )
      }

    return(
        <OverlayProvider>
            <Chat client={client}>
                {children}
            </Chat>
        </OverlayProvider>


    )
}