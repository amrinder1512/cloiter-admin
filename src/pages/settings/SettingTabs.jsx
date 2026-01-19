import Tabs from "../../UI/Tabs";
import ChangePassword from "./ChangePassword";
import UserInfo from "./UserInfo";
import { FiAlertCircle } from "react-icons/fi";
import { MdOutlineLock } from "react-icons/md";


const SettingTabs = () => {
  const list = [
    {
      icon: FiAlertCircle,
      title: "User Info",
      content: <UserInfo />,
    },
    {
      icon: MdOutlineLock,
      title: "Password",
      content: <ChangePassword />,
    },
    // {
    //   icon: Palette,
    //   title: "Theme",
    //   content: <ThemeSettings/>,
    // },
    //  {
    //   icon: MdSettingsSuggest ,
    //   title: "Lead Settings",
    //   content: <LeadProfitSettingsPage/>,
    // },
    // {
    //   icon: TfiEmail ,
    //   title: "Email SMTP",
    //   content: <SMTPSettings/>,
    // },
  ];

  return <Tabs list={list} />;
};

export default SettingTabs;
