import molecule from '@dtinsight/molecule';
import { UniqueId } from '@dtinsight/molecule/esm/common/types';
import { IEditorActionsProps, IExtension } from '@dtinsight/molecule/esm/model';
import { IExtensionService } from '@dtinsight/molecule/esm/services';
import { mdiShareVariant } from '@mdi/js';
import Icon from '@/pages/components/icon';
import { Button } from 'antd';
import { closeModal, updateModal } from '@/pages/components/customModal';
import Share from '@/pages/components/share';

export default class EditorExtension implements IExtension {
  id: UniqueId = 'editor';
  name: string = 'editor';
  activate(extensionCtx: IExtensionService): void {
    const { builtInEditorInitialActions } = molecule.builtin.getModules();
    const nextActions: IEditorActionsProps[] =
      builtInEditorInitialActions.concat();
    nextActions.push({
      id: 'share',
      icon: <Icon type={mdiShareVariant} color="var(--icon-foreground)" />,
      title: '分享',
      place: 'outer',
      sortIndex: 0,
    });

    molecule.editor.setDefaultActions(nextActions);

    molecule.editor.onActionsClick((menuId) => {
      if (menuId === 'share') {
        // TODO
        updateModal(<Share />, {
          title: '分享链接',
          onCancel: () => closeModal(),
          footer: <Button onClick={() => closeModal()}>取消</Button>,
        });
      }
    });

    molecule.editor.onUpdateTab((tab) => {
      tab.status = 'edited';
      molecule.editor.updateTab(tab);
    });
  }
  dispose(extensionCtx: IExtensionService): void {
    throw new Error('Method not implemented.');
  }
}
