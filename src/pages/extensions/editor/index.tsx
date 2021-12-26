import molecule from '@dtinsight/molecule';
import { UniqueId } from '@dtinsight/molecule/esm/common/types';
import { IEditorActionsProps, IExtension } from '@dtinsight/molecule/esm/model';
import { IExtensionService } from '@dtinsight/molecule/esm/services';
import { mdiShareVariant } from '@mdi/js';
import Icon from '@/pages/components/icon';

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
      place: 'outer',
      sortIndex: 0,
    });

    molecule.editor.setDefaultActions(nextActions);

    molecule.editor.onActionsClick((menuId) => {
      if (menuId === 'share') {
        // TODO
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
