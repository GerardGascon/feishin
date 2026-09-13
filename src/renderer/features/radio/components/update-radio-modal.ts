import { openContextModal } from '@mantine/modals';

import i18n from '/@/i18n/i18n';
import { useAuthStore } from '/@/renderer/store';
import { hasFeature } from '/@/shared/api/utils';
import { InternetRadioStation } from '/@/shared/types/domain-types';
import { ServerFeature } from '/@/shared/types/features-types';

export const openUpdateRadioModal = async (args: { radio: InternetRadioStation }) => {
    const { radio } = args;

    const server = useAuthStore.getState().currentServer;
    const hasImageUpload = hasFeature(server, ServerFeature.INTERNET_RADIO_IMAGE_UPLOAD);

    openContextModal({
        innerProps: {
            body: {
                homepageUrl: radio?.homepageUrl,
                name: radio?.name,
                streamUrl: radio?.streamUrl,
            },
            query: { id: radio?.id },
            stationImage: {
                imageId: radio.imageId,
                imageUrl: radio.imageUrl,
                uploadedImage: radio.uploadedImage,
            },
        },
        modal: 'updateRadio',
        size: hasImageUpload ? 'lg' : 'md',
        title: i18n.t('common.edit') as string,
    });
};
