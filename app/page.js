import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import TopNav from "./components/TopNav";
import Category from "./components/Category";
import Crousels from "./components/Crousels";
import Occasion from "./components/Occasion";
import FavouritePic from "./components/FavouritePic";
import SameDayDelivery from "./components/SameDayDelivery";
import Banner from "./components/Banner";
import SurpriseforLittleOne from "./components/SurpriseforLittleOne";
import CategoriesOption from "./components/CategoriesOption";
import CustomerStories from "./components/CustomerStories";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Stats from "./components/Stats";

export default function Home() {
  return (
   <>
   <TopNav/>
   <Category/>
   <Occasion/>
   <Crousels/>
   <FavouritePic/>
   <SameDayDelivery/>
   <Banner/>
   <SurpriseforLittleOne/>
   <CategoriesOption/>
   {/* <CustomerStories/> */}
   <Contact/>
   <Stats/>
   <Footer/>
   </>
  );
}
