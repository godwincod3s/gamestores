import vars from '@/globalvars'
import Header from '@/components/Header';
import {  NavbarButton } from "@/components/ui/resizable-navbar";
import Categories from '@/components/Categories';
import Features from '@/components/Features';
import LatestProducts from '@/components/LatestProducts';
import RecentProducts from '@/components/RecentProducts'

const { name } = vars;

export default function Home() {

  return (
    <>
        <Header className="px-4 lg:px-0" />

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-t-md">
            <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">Welcome to <span className='capitalize'>{name}</span> </h1>
            <p className="text-xl mb-8 text-gray-300">
                Discover the best games and gear
            </p>
            <NavbarButton href="/products" variant="gradient">
                Start Shopping
            </NavbarButton>
            </div>
        </section>
        <RecentProducts />
        <Features />
        <Categories />
        <LatestProducts perPage={12} />
    </>
  );
}