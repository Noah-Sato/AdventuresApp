import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { supabase } from '~/utils/supabase'
import { getAvatarPublicUrl } from '~/utils/avatarUrl'
import { StyleSheet, View, Alert, Image, Button } from 'react-native'
import { extFromAsset, pickImage } from '@src/utilities.js';
import { UserIcon } from '@components/userIcons';



interface Props {
  size: number;
  url: string | null;
  onUpload: (filePath: string) => void;
  onPressUpload: ()=>void;
}

export const Avatar =  forwardRef(function Avatar({ url, size = 150, onUpload, onPressUpload }: Props, ref) {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarSize = { height: size, width: size };


  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  function downloadImage(path: string) {
    setAvatarUrl(getAvatarPublicUrl(path))
  }

  async function onPhotoSourceSelected(source: 'camera' | 'library') {
    try {
      setUploading(true);

      const asset = await pickImage(source, {
        mediaTypes: ['images'], // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (!asset) return

      const image = asset;
      console.log('Got image', image);

      if (!image.uri) {
        throw new Error('No image uri!'); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer());
      console.log(arraybuffer.byteLength, 'array buffer')

      const fileExt = extFromAsset(image);
      const path = `${Date.now()}.${fileExt}`;
      console.log('path:',path)
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
          upsert: false
        },
      );

      if (uploadError) {
        throw uploadError;
      }
      const url = data.path
      onUpload(url);
    } catch (error) {
      if (error instanceof Error) {
        console.log('instance of error', error)
        Alert.alert(error.message);
      } else {
        
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }


  useImperativeHandle(ref, () => ({
      handlePhotoSource: onPhotoSourceSelected,
    }));


  return (
    <View>
      {avatarUrl ? (
        <View>
          <UserIcon size={'profile'} userImage={url}/>
        </View>
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <View>
        <Button
          title={uploading ? 'Uploading ...' : 'Upload'}
          onPress={onPressUpload}
          disabled={uploading}
        />
        
      </View>
    </View>
  );
})





const styles = StyleSheet.create({
  avatar: {
    borderRadius: 5,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 5,
  },
});