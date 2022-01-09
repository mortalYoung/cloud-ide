import { useEffect, useState, useLayoutEffect } from 'react';
import { history } from 'umi';
import { Form, Select, Radio, Button, Divider, Input, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import eventBus from '@/utils/eventBus';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

interface IRequestParams {
  shareTo: number;
  auth: number;
}

export enum AUTH_ENUM {
  READ_ONLY = 0,
  READ_AND_WRITE = 1,
}

export default () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [shareLink, setLink] = useState('');

  const editable = Boolean(shareLink);

  const handleFinish = (values: IRequestParams) => {
    if (!shareLink) {
      setLoading(true);
      fetch('/api/mo/share', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setLink(
              `${window.location.origin}${history.location.pathname}?share=${res.data}`,
            );
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      fetch('/api/mo/unShare', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setLink('');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useLayoutEffect(() => {
    console.log('history.location:', history.location);
    fetch('/api/mo/share', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const { data } = res;
          if (data) {
            const { shareTo, auth, md5 } = data;
            form.setFieldsValue({
              shareTo,
              auth,
            });
            setLink(
              `${window.location.origin}${history.location.pathname}?share=${md5}`,
            );
          }
        }
      });
    // function onOk() {
    //   form.validateFields().then((values) => {
    //     console.log(values);
    //   });
    // }
    // eventBus.subscribe('root', onOk);
    // return () => eventBus.unsubscribe('root');
  }, []);

  return (
    <>
      {editable && (
        <Alert
          type="info"
          showIcon
          icon={<LoadingOutlined />}
          message="当前仓库分享中...，点击取消分享按钮取消分享"
          style={{ marginBottom: 8 }}
        />
      )}
      <Form<IRequestParams>
        form={form}
        {...formItemLayout}
        initialValues={{ auth: 0 }}
        onFinish={handleFinish}
      >
        <Form.Item name="shareTo" label="分享人">
          <Select placeholder="请选择分享人" disabled={editable}>
            <Option value={1}>admin</Option>
          </Select>
        </Form.Item>
        <Form.Item name="auth" label="权限">
          <Radio.Group disabled={editable}>
            <Radio value={AUTH_ENUM.READ_ONLY}>只读权限</Radio>
            <Radio value={AUTH_ENUM.READ_AND_WRITE}>读写权限</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            {shareLink ? '取消分享' : '生成链接'}
          </Button>
        </Form.Item>
      </Form>
      {editable && (
        <>
          <Divider />
          <Input readOnly value={shareLink} />
        </>
      )}
    </>
  );
};
