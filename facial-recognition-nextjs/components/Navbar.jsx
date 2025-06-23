import Link from "next/link";
import React from "react";

const logo = "/assets/logo.png";

export default function Navbar() {
  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="Imag.e" className="w-[124px] h-[32px]" />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        <li className="font-poppins font-normal cursor-pointer text-[16px] text-white mr-10">
          <Link href="/">Home</Link>
        </li>
        <li className="font-poppins font-normal cursor-pointer text-[16px] text-white mr-10">
          <Link href="/upload">Upload</Link>
        </li>
        <li className="font-poppins font-normal cursor-pointer text-[16px] text-white mr-10">
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className="font-poppins font-normal cursor-pointer text-[16px] text-white mr-0">
          <Link href="/help">Help</Link>
        </li>
      </ul>
    </nav>
  );
}
