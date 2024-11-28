import { Helmet } from "react-helmet";
import { Img, Heading, Text } from "../../components";
import DatasetInputSection from "./DatasetInputSection";
import React from "react";

export default function Frame1176Page() {
    return (
        <>
            <Helmet>
                <title>Dataset Upload - Manage Your AI Training Data</title>
                <meta
                    name="description"
                    content="Upload and manage datasets for AI model training. Find datasets for reasoning, math, and scene capabilities, and contribute to the AI community's resources."
                />
            </Helmet>
            <div className="w-full bg-white-a700_01 py-6 sm:py-4">
                <div className="mb-9 flex flex-col gap-1.5">
                    <div className="relative ml-[62px] mr-14 h-[160px] lg:h-auto md:mx-0 md:h-auto">
                        <Img
                            src="images/img_ellipse_1378.svg"
                            alt="Profile Image"
                            className="mr-[74px] mt-[22px] h-[74px] w-[4%] rounded-[50%] lg:mr-0 md:mr-0"
                        />
                        <header className="absolute left-0 right-0 top-[19px] mx-auto flex flex-1 items-center px-[34px] py-3 sm:px-4">
                            <div className="flex w-[90%] items-center justify-between gap-5 lg:w-full md:w-full md:flex-col">
                                <div className="flex w-[14%] items-center justify-between gap-5 md:w-full">
                                    <Text
                                        size="text2x1"
                                        as="p"
                                        className="font-andadapro text-[32px] font-normal text-black-900 lg:text-[27px] md:text-[26px] sm:text-[24px]"
                                    >
                                        ModeLabs
                                    </Text>
                                    <a href="#">
                                        <Img src="images/img_profile.svg" alt="Profile Avatar" className="h-[32px]" />
                                    </a>
                                </div>
                                <div className="flex w-[44%] justify-center md:w-full">
                                    <div className="flex w-full flex-col items-end">
                                        <ul className="relative z-[1] flex flex-wrap gap-[50px]">
                                            <li>
                                                <a href="#">Link</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </header>
                    </div>
                </div>
            </div>
        </>
    );
}