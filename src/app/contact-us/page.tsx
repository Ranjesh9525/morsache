import HomeLayout from "@/components/layouts/HomeLayout";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <>
      <HomeLayout title="Contact us - Morsache Clothing">
        <div className="container lg:px-[15vw] lg:py-12">
          <h1 className=" text-center text-4xl mb-4 uppercase font-semibold">
            Contact Morsache
          </h1>
          <div className="theme-block text-center ">
            <div className="space-y-3">
              <p>
                We&apos;re here to help and would love to hear from you. Whether you
                have a question about our products, need assistance with an
                order, or just want to share your feedback, our team is ready to
                assist.
              </p>
              <p>
                <strong>Instagram Support</strong>:{" "}
                <a href="https://www.instagram.com/morsache/">Click Here</a>
              </p>
              <p>
                <strong>Whatsapp Support</strong>:{" "}
                <a
                  href="https://api.whatsapp.com/send?phone=916364430801&amp;text=Hello!"
                  target="_blank"
                  title="https://api.whatsapp.com/send?phone=916364430801&amp;text=Hello!"
                >
                  Click Here
                </a>
              </p>
              <p>
                <a href="tel:+91%206364430800" title="tel:+91 6364430800">
                  <br />
                </a>
                <strong>Operating Hours</strong>: Monday to Saturday, 10:00 AM -
                7:00 PM
              </p>
              <p>
                <strong>Returns and Exchanges</strong>
              </p>
              <p>
                For return and exchange, please visit our&nbsp;
                <a href="https://morsache.vercel.app/return-exchange-policy">
                  Returns &amp; Exchanges
                </a>
                &nbsp;page.
              </p>
              <p>
                <br />
                Thank you for choosing <strong>morsache</strong>. We&apos;re looking
                forward to assisting you!
              </p>
            </div>
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default Page;
