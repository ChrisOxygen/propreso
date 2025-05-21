import React from "react";

function PageHeader({
  pageTitle,
  pageDescription,
}: {
  pageTitle: string;
  pageDescription?: string;
}) {
  return (
    <header className="full-width-container relative h-[308px] bg-[url('/assets/about-page-header-bg-mobile.jpg')] bg-cover bg-center sm:h-[330px] sm:bg-[url('/assets/about-page-header-bg.jpg')] md:h-[600px]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#BF4008]/5"></div>
      <div className="content-box relative z-10 grid grid-rows-[40px_1fr] items-center justify-center gap-[70px] md:grid-rows-[133px_1fr] md:gap-[142px]">
        <div className="row-start-2 flex w-full max-w-[741px] flex-col items-center gap-[25px] self-stretch">
          <h1 className="w-[321px] text-center font-[Poppins] text-[32px] leading-[41px] font-semibold tracking-[-0.96px] text-[#151111] sm:w-auto sm:text-[64px] sm:leading-[73px] sm:tracking-[-2.56px] sm:text-[#2C2C2C]">
            {pageTitle}
          </h1>
          {pageDescription && (
            <p className="max-w-full text-center font-[Lato] text-base leading-6 font-normal tracking-[0.08px] text-[var(--body-text,#404040)] sm:max-w-[437px]">
              {pageDescription}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
