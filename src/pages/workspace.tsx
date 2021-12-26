import { MoleculeProvider, Workbench } from '@dtinsight/molecule';
import '@dtinsight/molecule/esm/style/mo.css';
import { useEffect } from 'react';
import CustomModal from './components/customModal';
import extensions from './extensions';

export default () => {
  useEffect(() => {
    const listener = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '离开当前页后，所编辑的数据将不可恢复';
    };
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, []);

  return (
    <>
      <MoleculeProvider extensions={extensions}>
        <Workbench />
      </MoleculeProvider>
      <CustomModal />
    </>
  );
};
