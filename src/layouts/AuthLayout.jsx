import { useEffect } from "react";
import { Outlet } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import { checkAuth } from "../store/slices/user";

const AuthLayout = () => {
  const dispatch = useDispatch();
  // const { logos } = useSelector((state) => state.settings);
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
  return (
    <main id="main" className="bg-gray-50 dark:bg-blue-950 dark:text-white">
      <div className="grid grid-cols-[1fr_1.5fr] h-screen overflow-hidden">
        <figure className="h-full">
          <div className="bg-[#434242] w-full h-full flex items-center justify-center">
            <img
              src={"/images/logo.png"}
              alt="Cloiter"
              className="w-60  h-22 text-white"
            />
          </div>
        </figure>
        <div className="flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
