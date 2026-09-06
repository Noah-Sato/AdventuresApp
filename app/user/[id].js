import { useLocalSearchParams, router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { mainStyles, bS } from '@theme/Styles';
import cl from '@theme/Colours';
import l from '@theme/Layout';
import { Text } from '@components/Text';
import { PageHeader } from '@components/pageGeneral/pageHeader';
import { UserIcon } from '@components/userIcons';
import { SquareButton } from '@components/Buttons';
import { useProfile, useFriends } from '@hooks/useFriends';
import { useStartDirectMessage } from '@hooks/useChat';
import { useAuth } from '~/contexts/AuthProvider';



export default function UserProfileScreen() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const { profile, loading } = useProfile(id);
    const { friends, incomingRequests, outgoingRequests, sendRequest, acceptRequest, declineRequest } = useFriends();
    const { startDirectMessage } = useStartDirectMessage();


    if (loading || !profile) {
        return (
            <View style={{height:l.screen.height, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator/>
            </View>
        )
    }

    const isSelf = user?.id == id;
    const friendRow = friends.find(f => f.profile.id == id)
    const incoming = incomingRequests.find(r => r.profile.id == id);
    const outgoing = outgoingRequests.find(r => r.profile.id == id);

    const onChatPress = async () => {
        const cid = await startDirectMessage(id);
        router.push(`/chatContainer/channel/${cid}`);
    };

    return(
        <View style={[mainStyles.page, { paddingHorizontal:l.margins.page}]}>
            <PageHeader back={true} onBackPress={()=> router.back()} label={' '}/>

            <View style={{alignItems:'center', gap:l.spacing, paddingTop:l.spacing.xl}}>
                <UserIcon UserImage={profile.avatar_url} size={'large'}/>
                <Text style={[bS.h3, {color:cl.basic.white, paddingTop:l.spacing.m}]}>{profile.username ?? profile.full_name}</Text>
            
                {!isSelf && (
                    <View style={{flexDirection:'row', gap:l.spacing.l, paddingTop:l.spacing.m, alignItems:'center'}}>
                        {friendRow && <Text style={[bS.body3, {color:cl.grey.eighty}]}>{'Friends'}</Text>}

                        {!friendRow && incoming && (
                            <>
                                <SquareButton label={'Accept'} size={'small'} fill onPress={() => acceptRequest(incoming.id)}/>
                                <SquareButton label={'Decline'} size={'small'} onPress={() => declineRequest(incoming.id)}/>
                            </>
                        )}

                        {!friendRow && !incoming && outgoing && (
                            <Text style={[bS.body3,{color:cl.grey.eighty}]}>{'[Requested]'}</Text>
                        )}

                        {!friendRow && !incoming && !outgoing && (
                            <SquareButton label={'Add Friend'} size={'small'} onPress={() => sendRequest(id)}/>
                        )}

                        <SquareButton label={'Chat'} size={'small'} onPress={onChatPress}/>
                    </View>    
                )}
            
            </View>
        </View>


    )




 }
