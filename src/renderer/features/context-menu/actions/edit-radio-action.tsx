import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { openUpdateRadioModal } from '/@/renderer/features/radio/components/update-radio-modal';
import { ContextMenu } from '/@/shared/components/context-menu/context-menu';
import { InternetRadioStation } from '/@/shared/types/domain-types';

interface EditRadioActionProps {
    disabled?: boolean;
    items: InternetRadioStation[];
}

export const EditRadioAction = ({ disabled, items }: EditRadioActionProps) => {
    const { t } = useTranslation();

    const handleEditRadio = useCallback(async () => {
        if (items.length === 0) return;

        const radio = items[0];

        openUpdateRadioModal({
            radio,
        });
    }, [items]);

    if (items.length === 0 || items.length > 1) return null;

    return (
        <ContextMenu.Item disabled={disabled} leftIcon="edit" onSelect={handleEditRadio}>
            {'Edit Radio'}
        </ContextMenu.Item>
    );
};
