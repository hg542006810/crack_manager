import ProLayout from '@ant-design/pro-layout';
import defaultProps from './data.d';
import { Link } from 'umi';

export default (props: any) => {
  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        {...defaultProps}
        title="密码恢复站管理端"
        fixSiderbar={true}
        logo={() => null}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            menuItemProps.children
          ) {
            return defaultDom;
          }
          return (
            <Link to={menuItemProps.path}>
              {menuItemProps.path !== '/' && menuItemProps.icon}
              {defaultDom}
            </Link>
          );
        }}
      >
        {props.children}
      </ProLayout>
    </div>
  );
};
