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
                homepageUrl: radio?.homepageUrl || undefined,
                name: radio?.name,
                streamUrl: radio?.streamUrl,
            },
            internetRadioImage: {
                imageId: radio.imageId,
                imageUrl: radio.imageUrl,
                uploadedImage: radio.uploadedImage,
            },
            query: { id: radio?.id },
        },
        modal: 'updateInternetRadioStation',
        size: hasImageUpload ? 'lg' : 'md',
        title: i18n.t('form.editRadio.title') as string,
    });
};
