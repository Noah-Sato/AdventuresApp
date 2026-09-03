import { Ref } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

interface PhotoSourceBottomSheetProps {
    onSelect: (source: 'camera' | 'libray') => void;
}



declare const PhotoSourceBottomSheet: (
    props: PhotoSourceBottomSheetProps & { ref?: Ref<BottomSheet> }

) => JSX.Element;


export default PhotoSourceBottomSheet;