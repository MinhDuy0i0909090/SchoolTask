import vi from "antd/locale/vi_VN";
import { ConfigProvider } from "antd";

function AntDProvider({ children }) {
  return (
    <ConfigProvider
      componentSize="middle"
      //   locale={vi}

      theme={{
        token: {
          // colorPrimary: "#9ca3af", // xám
          // colorInfo: "#006b78",
          // colorTextBase: "#333333", // text table
          // //   colorTextDisabled: "#333333ad",
          // colorPrimaryBg: "#ffff", //
          // colorPrimaryBgHover: "#f3f4f6", //xam nhat
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default AntDProvider;
