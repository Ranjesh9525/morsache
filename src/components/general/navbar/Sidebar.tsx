import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronDown } from "react-icons/fa6";
import { User2 } from "lucide-react";

type Props = {
  sideNav: { open: boolean };
  setSideNav: React.Dispatch<React.SetStateAction<{ open: boolean }>>;
};

const Sidebar = ({ sideNav, setSideNav }: Props) => {
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);
  const user = {
    role: "user",
  };

  const pathname = usePathname();
  const [navItems, setNavItems] = useState<any[]>([]);
  const userNavItems = [
    {
      sectionName: "",
      sectionIcon: "",
      section: [
        {
          name: "Morsache plus",
          path: "/dashboard",
          showIfNotLoggedIn: false,
          exact: true,
        },
      ],
    },
    {
      sectionName: "store",
      section: [
        {
          name: "shirt",
          path: "/marketplace",
          showIfNotLoggedIn: true,
          exact: true,
        },
        {
          name: "T-shirts",
          path: "/marketplace/categories",
          showIfNotLoggedIn: true,
          exact: true,
        },
        {
          name: "Trousers",
          path: "/marketplace/cart",
          showIfNotLoggedIn: true,
          exact: true,
        },
        {
          name: "Cargo pants",
          path: "/marketplace/orders",
          showIfNotLoggedIn: true,
          exact: true,
        },
      ],
    },
    {
      sectionName: "",
      section: [
        {
          name: "Track order",
          path: "/watchhub",
          showIfNotLoggedIn: true,
          exact: true,
        },
        {
          name: "place a return / Exchange request",
          path: "/courses",
          showIfNotLoggedIn: true,
          exact: true,
        },
        {
          name: "customer support",
          path: "/courses/me",
          showIfNotLoggedIn: false,
          exact: true,
        },
        {
          name: "Visit store",
          path: "/watchhub/history",
          showIfNotLoggedIn: true,
          exact: true,
        },
        {
          name: "relove",
          path: "/watchhub/history",
          showIfNotLoggedIn: true,
          exact: true,
        },
      ],
    },
  ];
  const sideNavVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 40,
      },
    },
    closed: {
      x: -600,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
      },
    },
  };
  // const mobile = window.matchMedia("(max-width: 768px)").matches;
  //   const sideNav = useAppSelector(
  //     (state) => state.persistedReducer.sideNav.values
  //   );
  //   const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    // if (popUp) {
    //   dispatch(closeSideBar());
    // }
    //setOpenAccordions((prev) => [...prev, 1, 2]);
    if (user && user.role === "affiliate") {
      // setNavItems(AffiliateNavItems);
    } else if (user && user.role === "user") {
      setNavItems(userNavItems);
    } else {
      setNavItems(userNavItems);
    }
  }, []);

  return (
    <motion.div
      initial={{ display: " flex" }}
      animate={!sideNav.open ? { display: "none" } : { display: " flex" }}
      transition={{ delay: 0.5 }}
      className={` h-screen w-full z-[130]  fixed top-0 left-0 ${
        sideNav.open &&
        "  backdrop-filter backdrop-brightness-50 backdrop-blur-sm"
      } `}
    >
      <motion.div
        initial={"closed"}
        className={` h-screen w-[380px] bg-white  `}
        variants={sideNavVariants}
        animate={sideNav.open ? "open" : "closed"}
      >
        <div className="p-4 pl-6 pt-6 inline-flex items-center gap-2 font-light uppercase">
          <User2
            size={28}
            className="bg-gray-300 font-light p-1 rounded-full"
          />{" "}
          Login
        </div>
        <div
          className={
            "  h-screen text-text-theme-color overflow-y-hidden hover:overflow-y-auto  z-40 top-0 left-0  "
          }
        >
          <section className=" flex flex-col gap-4 ">
            <ul className="flex flex-col py-2 px-3 text-lg font-medium uppercase">
              {navItems.map((items, itemsIndex) => {
                const accordionOpen = openAccordions.find(
                  (accordionIndex) => accordionIndex == itemsIndex
                );
                return (
                  <ul
                    key={itemsIndex}
                    className="flex flex-col  text-lg font-medium "
                  >
                    {/* <p>{items.sectionName}</p> */}
                    {/* { itemsIndex > 0 && <DropdownMenuSeparator  className="bg-slate-400 "/>} */}
                    {items.sectionName ? (
                      <li>
                        <span
                          onClick={() =>
                            accordionOpen
                              ? setOpenAccordions(
                                  openAccordions.filter(
                                    (accordionIndex) =>
                                      accordionIndex !== itemsIndex
                                  )
                                )
                              : setOpenAccordions((prev) => [
                                  ...prev,
                                  itemsIndex,
                                ])
                          }
                          className={
                            "flex items-center w-full gap-16 text-text-theme-color text-lg lead-2ing- font-light px-8 h-auto pl-3 py-3 hover:bg-primary-color-foreground hover:rounded-lg cursor-pointer"
                          }
                        >
                          {/* */}

                          <p className="flex justify-between font-medium text-lg">
                            {items.sectionName}{" "}
                          </p>
                          <motion.span
                            initial={{ rotate: 0 }}
                            animate={
                              accordionOpen ? { rotate: 180 } : { rotate: 0 }
                            }
                          >
                            <FaChevronDown />{" "}
                          </motion.span>
                        </span>
                        <ul>
                          {openAccordions.find(
                            (accordionIndex) => accordionIndex == itemsIndex
                          ) &&
                            items.section.map((section: any, index: number) => {
                              if (sideNav.open) {
                                return (
                                  <li key={index}>
                                    <Link
                                      key={index}
                                      href={section.path}
                                      onClick={() =>
                                        setSideNav({ open: false })
                                      } //dispatch(closeSideBar())}
                                      className={
                                        pathname == section.path
                                          ? "flex items-center gap-16 text-secondary-color text-lg leading-[1-2rem] font-light px-8 h-auto pl-3 py-3  hover:bg-primary-color-foreground hover:rounded-lg"
                                          : "flex items-center gap-16 text-text-theme-color text-lg leading-[1-2rem] font-light px-8 h-auto pl-3 py-3 hover:bg-primary-color-foreground hover:rounded-lg"
                                      }
                                    >
                                      <p>{section.name}</p>
                                    </Link>
                                  </li>
                                );
                              }
                            })}
                        </ul>
                      </li>
                    ) : (
                      <>
                        {items.section.map((section: any, index: number) => {
                          if (sideNav.open) {
                            return (
                              <li key={index}>
                                <Link
                                  key={index}
                                  href={section.path}
                                  onClick={() => setSideNav({ open: false })} // dispatch(closeSideBar())}
                                  className={
                                    pathname == section.path
                                      ? "flex items-center gap-16 text-secondary-color text-lg leading-[1-2rem] font-light px-8 h-auto pl-3 py-3  hover:bg-primary-color-foreground hover:rounded-lg"
                                      : "flex items-center gap-16 text-text-theme-color text-lg leading-[1-2rem] font-light px-8 h-auto pl-3 py-3 hover:bg-primary-color-foreground hover:rounded-lg"
                                  }
                                >
                                  <p>{section.name}</p>
                                </Link>
                              </li>
                            );
                          } else {
                            return (
                              <li key={index}>
                                <Link
                                  href={section.path}
                                  className={
                                    pathname == section.path
                                      ? "flex items-center text-secondary-color text-[1.2rem] font-light px-2 h-[37px]  hover:bg-primary-color-foreground hover:rounded-lg"
                                      : "flex items-center text-text-theme-color text-[1.2rem] font-light px-2 h-[37px] hover:bg-primary-color-foreground hover:rounded-lg"
                                  }
                                ></Link>
                              </li>
                            );
                          }
                        })}
                      </>
                    )}
                  </ul>
                );
              })}
            </ul>
            <div className="flex flex-col gap-4 pb-5 px-2">
              {/* <SupportBox /> */}
              {/* {sideNav.open ? (
                  <button
                    onClick={() => onLogout()}
                    className="flex items-center gap-16  text-text-theme-color text-[1rem] font-light px-3"
                  >
                    <MdLogout className="text-red-600 w-4 h-4" /> <p>Logout</p>
                  </button>
                ) : (
                  <button
                    className="flex items-center px-2 w-full"
                    onClick={() => onLogout()}
                  >
                    <MdLogout className="text-red-600 w-5 h-5 " />
                  </button>
                )} */}
            </div>
          </section>
        </div>
      </motion.div>
      <div
        className="w-full h-full "
        onClick={() => setSideNav({ open: false })} // dispatch(closeSideBar())}
      ></div>
    </motion.div>
  );
};

export default Sidebar;
