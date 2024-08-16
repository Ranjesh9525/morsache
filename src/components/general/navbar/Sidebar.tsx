import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronDown } from "react-icons/fa6";
import { ArrowRightIcon, User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { FaInstagram,FaFacebook,FaLinkedinIn,FaTwitter } from "react-icons/fa6";
import { MdLogout} from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { FetchCategoriesNamesOnly } from "@/serverlessActions/_fetchActions";
import { ClipLoader } from "react-spinners";




type Props = {
  sideNav: { open: boolean };
  setSideNav: React.Dispatch<React.SetStateAction<{ open: boolean }>>;
};

const Sidebar = ({ sideNav, setSideNav }: Props) => {
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);
  const user = {
    role: "user",
  };
  const { data: session }: any = useSession();

  const pathname = usePathname();
  const [navItems, setNavItems] = useState<any[]>([]);
  const userNavItems = [
    {
      sectionName: "",
      sectionIcon: "",
      section: [
        {
          name: "Morsache plus",
          path: "/",
          showIfNotLoggedIn: false,
          exact: true,
        },

      ],
    },   
    {
      sectionName: "Categories",
      section: [
        // {
        //   name: "T-shirts",
        //   path: "/products/category/t-shirts",
        //   showIfNotLoggedIn: true,
        //   exact: true,
        // },
        // {
        //   name: "Casual Shirts",
        //   path: "/products/category/casual",
        //   showIfNotLoggedIn: true,
        //   exact: true,
        // },

      ],
    },
    {
      sectionName: "",
      section: [
        {
          name: "Track order",
          path: "/orders",
          showIfNotLoggedIn: true,
          exact: true,
        },
       
        {
          name: "place a return / Exchange request",
          path: "/return",
          showIfNotLoggedIn: true,
          exact: true,
        },
        {
          name: "customer support",
          path: "/support",
          showIfNotLoggedIn: false,
          exact: true,
        },
        {
          name: "Visit store",
          path: "/products",
          showIfNotLoggedIn: true,
          exact: true,
        },
      ],
    },
  ];
  const {isPending,data:response,error,isError}=useQuery({
    queryKey: ["categories"],
    queryFn: () => FetchCategoriesNamesOnly(),
  })
  useEffect(() => {
    if(response?.data){
      console.log(response)
      response.data.forEach((item: any) => {
        userNavItems[response.data.length > 1 ? 1 : 0].section.push({ name: item.name, path: `/products/category/${item.name.replaceAll(" ", "-")}`, showIfNotLoggedIn: true, exact: true })
      })
      setNavItems(userNavItems);
    }
  },[response])
  useEffect(() => {
    if(isError){
      console.log(error)
    }
    
  },[isError])
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
        <span className="p-4 px-6 pt-6 inline-flex justify-between items-center w-full font-light uppercase">
          {!session?.user ? (
            <Link href="/auth/login"  scroll={true} className="inline-flex font-semibold items-center gap-2">
              {" "}
              <User2
                size={28}
                className="bg-gray-300  p-[0.35rem] font-light rounded-full"
              />{" "}
              Login
            </Link>
          ) : (
            <Link href="/account"  scroll={true} className="inline-flex font-medium items-center gap-2">
              {" "}
              <User2
                size={30}
                className="bg-gray-300 font-light  p-[0.35rem] rounded-full"
              />{" "}
              My Account
            </Link>
          )}
          <h1
            className="text-lg font-medium cursor-pointer"
            onClick={() => setSideNav({ open: false })}
          >
            X
          </h1>
        </span>
        <div
          className={
            "  h-screen text-text-theme-color overflow-y-hidden hover:overflow-y-auto  z-40 top-0 left-0  "
          }
        >
         { isPending? <ClipLoader className="mx-auto my-auto"/>: <section className=" flex flex-col gap-4 justify-between h-full ">
            <section className="flex flex-col py-2 px-3 text-lg font-medium uppercase">
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
                                      scroll={true}
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
              {session?.user && <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 uppercase text-text-theme-color text-[1.05rem] mt-2 font-light px-3 tracking-wider"
                  >
                   <p>Logout</p> <ArrowRightIcon size={21}/>
                  </button>}
            </section>
    
            <div className="flex flex-row w-full pb-5 px-2">
           
              
                  
                
                <span className=" w-full border-l-0 p-4"> <FaInstagram size={25}/></span>
                <span className=" w-full p-4"> <FaFacebook size={25} /></span>
                <span className=" w-full p-4"><FaTwitter size={25} /></span>
                <span className=" w-full p-4"> <FaLinkedinIn size={25} /></span>
            </div>
            
                      <div>    </div>
          </section>}
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
