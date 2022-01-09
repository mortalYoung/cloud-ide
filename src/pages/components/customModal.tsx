import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/lib/modal/Modal';
import eventBus from '@/utils/eventBus';

type DispatchAction<T> = React.Dispatch<React.SetStateAction<T>>;

const listener = new Map<
  string,
  {
    setChildren: DispatchAction<React.ReactNode>;
    setVisible: DispatchAction<boolean>;
    setConfig: DispatchAction<Partial<ModalProps>>;
  }
>();

export function updateModal(
  children: React.ReactNode,
  config: Partial<ModalProps> = {},
  key: string = 'root',
) {
  const targetModal = listener.get(key);
  if (targetModal) {
    targetModal.setVisible(true);
    targetModal.setChildren(children);
    targetModal.setConfig(config);
  }
}

export function closeModal(key: string = 'root') {
  const targetModal = listener.get(key);
  if (targetModal) {
    targetModal.setVisible(false);
  }
}

export default ({
  modalKey = 'root',
  ...props
}: { modalKey?: string } & ModalProps) => {
  const [children, setChildren] = useState<React.ReactNode>(null);
  const [visible, setVisible] = useState(false);
  const [customConfig, setConfig] = useState<Partial<ModalProps>>({});

  const handleOk = () => {
    eventBus.emit(modalKey);
  };

  useEffect(() => {
    listener.set(modalKey, { setChildren, setVisible, setConfig });
  });

  return (
    <Modal
      visible={visible}
      onOk={handleOk}
      destroyOnClose
      {...customConfig}
      {...props}
    >
      {children}
    </Modal>
  );
};
