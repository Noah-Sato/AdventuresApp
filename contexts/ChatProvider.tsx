import { PropsWithChildren, useState, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";


import { StreamChat } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { useAuth } from "./AuthProvider";
import { tokenProvider } from "~/utils/tokenProvider";
import { getAvatarPublicUrl } from "~/utils/avatarUrl";


const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);


export default function ChatProvider({children}: PropsWithChildren) {

    const [isReady, setIsReady] = useState(false)
    const { profile, isAuthenticated } = useAuth();

    useEffect(()=>{
        let cancelled = false;
        setIsReady(false);

        // Always route through here so disconnect is fully awaited before any
        // subsequent connect starts -- an unawaited disconnectUser() racing a
        // later connectUser() can clobber the freshly-set token and produce
        // "Both secret and user tokens are not set" errors deep in the SDK.
        const sync = async () => {
          if (client.userID) {
            await client.disconnectUser();
          }

          if (cancelled || !profile) {
            return;
          }

          await client.connectUser(
            {
              id: profile.id,
              name: profile.full_name,
              image: getAvatarPublicUrl(profile.avatar_url),
            },
            tokenProvider
          );
          if (!cancelled) {
            setIsReady(true)
          }
        }
        sync();
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