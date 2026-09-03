import { router } from 'expo-router';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useMemo } from 'react';
import { format, isTomorrow } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mainStyles, bS } from '@theme/Styles';
import cl from '@theme/Colours';
import l from '@theme/Layout';
import { Text } from '@components/Text';
import { SquareButton } from '@components/Buttons';
import { PageHeader } from '@components/pageGeneral/pageHeader';

import { useUpcomingEvents, usePublicEvents } from '@hooks/useEvents';
import { useMyAttendance } from '@hooks/useAttendance';
import { useUnifiedPhotoFeed } from '@hooks/useEventPhotos';
import { pickImage } from '../../src/utilities';

// Posting window mirrors the RLS policy: 2h before start_date through 24h after end_date
// (or start_date + 4h if no end_date set). This is a UX-only check -- RLS is the real gate.
function isWithinPostingWindow(event) {
    if (!event) return false
    const now = new Date()
    const start = new Date(event.start_date)
    const windowStart = new Date(start.getTime() - 2 * 60 * 60 * 1000)
    const end = event.end_date ? new Date(event.end_date) : new Date(start.getTime() + 4 * 60 * 60 * 1000)
    const windowEnd = new Date(end.getTime() + 24 * 60 * 60 * 1000)
    return now >= windowStart && now <= windowEnd
}

function NextEventHighlight({ event }) {
    const { attendance } = useMyAttendance(event?.id)
    const canPost = attendance?.status === 'going' && isWithinPostingWindow(event)

    if (!event) return null

    const label = isTomorrow(new Date(event.start_date))
        ? `Tomorrow, ${format(new Date(event.start_date), 'p')}`
        : format(new Date(event.start_date), 'do MMM, p')

    return (
        <TouchableOpacity
            style={{
                marginHorizontal: l.margins.page,
                marginBottom: l.spacing.l,
                borderWidth: l.spacing.xs3,
                borderColor: cl.basic.white,
                borderRadius: l.spacing.xs,
                padding: l.spacing.s,
                gap: l.spacing.xs,
            }}
            onPress={() => router.push(`/event/${event.id}`)}
        >
            <Text style={[bS.body3, { color: cl.grey.eighty }]}>{'Coming up'}</Text>
            <Text style={[bS.h5, { color: cl.basic.white }]}>{event.title}</Text>
            <Text style={[bS.body2, { color: cl.red.light_thirty }]}>{label}</Text>
            {canPost && (
                <View style={{ paddingTop: l.spacing.xs }}>
                    <SquareButton
                        label={'Post a Photo'}
                        size={'small'}
                        fill={true}
                        onPress={() => router.push(`/event/${event.id}/photos`)}
                    />
                </View>
            )}
        </TouchableOpacity>
    )
}

function FeedItem({ photo }) {
    return (
        <TouchableOpacity
            style={{ marginHorizontal: l.margins.page, marginBottom: l.spacing.m, gap: l.spacing.xs }}
            onPress={() => router.push(`/event/${photo.event_id}/photos`)}
        >
            {photo.signedUrl && (
                <Image
                    source={{ uri: photo.signedUrl }}
                    style={{ width: '100%', height: l.screen.width * 0.9, borderRadius: l.spacing.xs }}
                    resizeMode={'cover'}
                />
            )}
            <Text style={[bS.body3, { color: cl.grey.eighty }]}>{photo.event?.title}</Text>
        </TouchableOpacity>
    )
}

function PublicEventRow({ event }) {
    return (
        <TouchableOpacity
            style={{
                width: l.screen.width * 0.6,
                marginRight: l.spacing.s,
                borderWidth: l.spacing.xs3,
                borderColor: cl.basic.white,
                borderRadius: l.spacing.xs,
                padding: l.spacing.s,
                gap: l.spacing.xs2,
            }}
            onPress={() => router.push(`/event/${event.id}`)}
        >
            <Text numberOfLines={1} style={[bS.body2, { color: cl.basic.white }]}>{event.title}</Text>
            <Text style={[bS.body3, { color: cl.grey.eighty }]}>{format(new Date(event.start_date), 'do MMM, p')}</Text>
        </TouchableOpacity>
    )
}

export default function Page() {
    const insets = useSafeAreaInsets()
    const { events: upcoming } = useUpcomingEvents()
    const { photos } = useUnifiedPhotoFeed()

    const nextEvent = useMemo(() => {
        const now = new Date()
        return upcoming
            .filter((e) => new Date(e.start_date) >= now)
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))[0] ?? null
    }, [upcoming])

    const { events: publicEvents } = usePublicEvents(upcoming.map((e) => e.id))

    return (
        <ScrollView style={[mainStyles.page, { paddingTop: insets.top }]}>
            <View style={{ paddingHorizontal: l.margins.page, paddingBottom: l.spacing.l }}>
                <PageHeader label={'Home'} />
            </View>

            <NextEventHighlight event={nextEvent} />

            {publicEvents.length > 0 && (
                <View style={{ paddingBottom: l.spacing.l }}>
                    <Text style={[bS.h6, { color: cl.basic.white, paddingHorizontal: l.margins.page, paddingBottom: l.spacing.xs }]}>
                        {'Happening nearby'}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: l.margins.page }}>
                        {publicEvents.map((event) => <PublicEventRow key={event.id} event={event} />)}
                    </ScrollView>
                </View>
            )}

            <Text style={[bS.h6, { color: cl.basic.white, paddingHorizontal: l.margins.page, paddingBottom: l.spacing.s }]}>
                {'Feed'}
            </Text>
            {photos.length === 0 && (
                <Text style={[bS.body2, { color: cl.grey.eighty, paddingHorizontal: l.margins.page }]}>
                    {'No photos yet -- they show up here as soon as your events go live.'}
                </Text>
            )}
            {photos.map((photo) => <FeedItem key={photo.id} photo={photo} />)}

            <View style={{ height: l.spacing.xl3 }} />
        </ScrollView>
    )
}
