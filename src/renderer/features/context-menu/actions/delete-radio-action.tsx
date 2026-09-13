import { closeAllModals, openModal } from '@mantine/modals';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useDeleteRadioStation } from '/@/renderer/features/radio/mutations/delete-radio-station-mutation';
import { AppRoute } from '/@/renderer/router/routes';
import { useCurrentServerId } from '/@/renderer/store';
import { ContextMenu } from '/@/shared/components/context-menu/context-menu';
import { ConfirmModal } from '/@/shared/components/modal/modal';
import { Text } from '/@/shared/components/text/text';
import { toast } from '/@/shared/components/toast/toast';
import { InternetRadioStation } from '/@/shared/types/domain-types';

interface DeleteRadioActionProps {
    disabled?: boolean;
    items: InternetRadioStation[];
}

export const DeleteRadioAction = ({ disabled, items }: DeleteRadioActionProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const serverId = useCurrentServerId();
    const deleteRadioMutation = useDeleteRadioStation({});

    const handleDeleteRadio = useCallback(async () => {
        if (items.length === 0 || !serverId) return;

        try {
            await Promise.all(
                items.map((radio) =>
                    deleteRadioMutation.mutateAsync({
                        apiClientProps: { serverId },
                        query: { id: radio.id },
                    }),
                ),
            );

            navigate(AppRoute.RADIO, { replace: true });
            toast.success({
                message: t('action.deleteRadio'),
            });
        } catch (err: any) {
            toast.error({
                message: err.message,
                title: t('error.genericError'),
            });
        }

        closeAllModals();
    }, [deleteRadioMutation, items, navigate, serverId, t]);

    const openDeleteRadioModal = useCallback(() => {
        if (items.length === 0) return;

        openModal({
            children: (
                <ConfirmModal onConfirm={handleDeleteRadio}>
                    <Text>{t('common.areYouSure')}</Text>
                </ConfirmModal>
            ),
            title: t('form.deleteRadio.title'),
        });
    }, [handleDeleteRadio, items.length, t]);

    if (items.length === 0) return null;

    return (
        <ContextMenu.Item disabled={disabled} leftIcon="remove" onSelect={openDeleteRadioModal}>
            {t('action.deleteRadio')}
        </ContextMenu.Item>
    );
};
