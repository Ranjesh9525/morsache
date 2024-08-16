"use client";
import CheckoutLayout from "@/components/layouts/CheckoutLayout";
import React, { useState } from "react";
import CheckoutCard from "../../components/CheckoutCard";

import ShippingInformation from "../../components/ShippingInformation";
import { useMutation } from "@tanstack/react-query";

type Props = {
  params: {
    cartId: string;
  };
};

const page = (props: Props) => {
  const [fetchedCart, setFetchedCart] = useState(null);
  // const {
  //   isPending: productsFromFilterIsPending,
  //   isError: productsFromFilterIsError,
  //   data: productsFromFilterResponse,
  //   error: productsFromFilterError,
  //   mutate: server_fetchProductsFromFilterData,
  // } = useMutation({
  //   mutationFn: FetchProductsFromFilterData,
  // });
  return (
    <CheckoutLayout title="Checkout - Morsache Clothing">
      <div className="w-full container grid grid-cols-9 mb-9 mt-4 gap-4">
        <div className="col-span-6">
          <ShippingInformation />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat unde
          asperiores perferendis natus voluptatum impedit enim eligendi nostrum
          ad libero labore sunt vero, nobis nisi fuga ullam veniam! Expedita
          debitis voluptatibus deleniti labore impedit voluptas ducimus sapiente
          repudiandae iure architecto corporis neque, inventore sunt voluptates
          minima reprehenderit, odit illum! Quaerat itaque deleniti, natus
          numquam nisi necessitatibus reiciendis fugiat commodi harum, labore
          quo molestiae fuga. Nostrum, magni nemo pariatur dolor doloribus
          asperiores vero maiores ex, quasi est blanditiis. Ipsam, quisquam!
          Repudiandae optio porro at voluptatem nam minima, rerum corrupti sunt
          eos ipsa repellat tempora commodi distinctio cumque quidem dolor rem
          soluta sint quisquam. Doloribus, praesentium quia debitis quo incidunt
          quis. Possimus, ratione necessitatibus. Earum dolorem non, similique
          pariatur repellendus et itaque soluta! Distinctio quasi velit officia
          possimus ad quaerat porro voluptates suscipit sint, nulla maxime
          facilis qui fugit! Itaque, inventore fugiat blanditiis dicta earum
          laborum in nihil hic, autem eveniet porro odit maiores commodi quae
          similique officia rem praesentium mollitia dolorem delectus
          necessitatibus ea. Vero quos sunt iure nihil corporis esse facilis
          harum iste sit repellendus numquam et expedita eligendi mollitia
          quaerat velit aut, earum aliquam doloremque officia voluptate quod!
          Aliquam minus sunt aliquid distinctio nisi, veniam maiores nam libero
          dolor sit, vitae, natus alias omnis voluptas. Asperiores, aspernatur
          impedit quod ipsum tenetur assumenda odio id rem nulla dicta fugiat
          iusto vel eos blanditiis maxime distinctio ipsam, molestias voluptate
          beatae autem cupiditate. Totam similique autem qui assumenda
          consequatur illo molestias quas eum minus dolorem vel officiis
          accusantium, sapiente ipsa blanditiis ratione quos inventore atque
          fuga. Inventore assumenda labore accusantium itaque? Reiciendis maxime
          assumenda aliquam officiis voluptatum, perspiciatis dolore quibusdam
          asperiores doloremque! Qui exercitationem at voluptas voluptatem.
          Accusamus, dolores quam hic fugiat omnis perferendis consequuntur
          voluptates fugit quaerat quia labore quod incidunt, eum repellat ex
          nesciunt doloremque iusto soluta amet temporibus totam inventore
          suscipit iste. Magni, iure rem itaque voluptatum veniam at odio quae
          et, corrupti eligendi magnam unde placeat cumque sed? Minus itaque
          voluptatem tempore nobis consequatur, facere molestiae. Cumque
          laboriosam veritatis animi non fugit tenetur saepe, quibusdam dolorem,
          maiores molestiae natus ullam quaerat pariatur reprehenderit ex
          architecto nemo. Eum repudiandae velit repellendus quidem ratione rem,
          voluptatum sed ea? Esse harum non dicta assumenda, molestiae
          perspiciatis a eum ducimus, provident totam, aperiam quo. Modi minima
          distinctio pariatur impedit qui at eius laboriosam laudantium saepe
          eligendi! Nemo nisi, perspiciatis dolor quasi fugit excepturi corporis
          dicta consequatur ea quos amet possimus similique temporibus
          repellendus debitis vitae facere, eveniet provident, ab atque vel
          porro dolorem soluta. In asperiores, repellendus molestias explicabo
          voluptatum odit laborum veritatis fuga consequuntur deleniti enim
          quaerat nihil iste laudantium a. Debitis amet dolores recusandae
          ducimus suscipit quaerat, consequuntur tenetur ut perspiciatis quia
          quasi! Eaque ex tempora, cum voluptas sed consectetur veritatis
          provident nulla exercitationem vero maxime. Ex adipisci autem atque
          error at officia magnam ab repudiandae, ad ut voluptate minima odit
          commodi tempore iste nihil repellendus, eveniet eaque alias omnis sed
          dolor a. Voluptatem ut atque non doloribus fugiat qui error et
          provident ab quidem hic, ullam quis ipsum cumque. Aliquid culpa hic
          ex, voluptas dolorum quam suscipit, eveniet consequatur incidunt
          possimus quasi tenetur officiis aut iusto non eum, exercitationem
          voluptatibus assumenda laudantium vero. Voluptate quia in doloribus,
          dicta culpa natus! Possimus voluptates, pariatur eos optio minus
          dolore nemo accusamus est. Quam delectus harum repellat itaque quia
          sapiente dolor sed incidunt deserunt labore quis, amet placeat?
          Nostrum perspiciatis suscipit quo dicta nemo corporis voluptates, rem,
          nihil sequi, eos repudiandae quae distinctio error? Sunt cumque
          corrupti numquam excepturi quam, in doloribus, qui officiis quas
          cupiditate earum odio quos delectus. Aspernatur laboriosam quis
          cupiditate neque doloribus dignissimos maiores eaque autem eos iste
          temporibus esse expedita provident qui vero ut nesciunt animi, magnam
          alias hic error. Voluptatibus dolorum molestias minus asperiores
          corrupti expedita officiis ab sed nobis dicta! Maiores exercitationem
          magni debitis unde pariatur iure fugit saepe animi temporibus eos
          dignissimos quia voluptatum ad, assumenda quaerat neque consequatur
          repudiandae, inventore iste cum quibusdam dolore asperiores ab
          consectetur. Laboriosam accusantium et fuga? Delectus eaque odit
          eligendi numquam. Consequatur voluptatibus id deleniti nulla
          laudantium ducimus obcaecati eligendi velit temporibus libero rerum,
          ullam quis, tempora et amet eos est facere eum sint? Excepturi est
          eaque ad. Minus unde mollitia nemo ex? Saepe ullam, a reprehenderit
          expedita dolor minima quo vitae fugit mollitia deserunt adipisci
          consequatur. Laborum aut voluptatem accusantium at animi tempore
          exercitationem corporis aliquid cumque qui deserunt doloribus vero est
          sint, soluta iusto maxime eos fugiat molestiae vitae. Laboriosam ab
          possimus aperiam magnam numquam esse iure vel mollitia sit asperiores
          nihil, excepturi at pariatur quod architecto suscipit atque fugiat
          ducimus! Corrupti sint tempora cupiditate minus consectetur dolor
          molestias quos recusandae, quia nesciunt nisi exercitationem ducimus
          maxime! Ipsa, exercitationem deserunt blanditiis et iusto expedita sit
          officiis a ipsam quod tenetur at recusandae eius illo numquam
          repellendus error accusamus consequatur consequuntur! Veritatis natus
          dignissimos sed aut nostrum, libero, vitae eius, pariatur tempore
          laboriosam alias vero ducimus nobis facilis. Atque quos quaerat, unde
          numquam vel tenetur vitae dolor minus nemo nihil repudiandae, omnis
          esse corrupti harum aut optio pariatur facere! Enim quaerat nulla
          quisquam, nesciunt id atque voluptatum quae cumque accusamus
          accusantium reiciendis dolorem laudantium suscipit ea quasi ex, neque
          sed nam perferendis ab sequi, rerum quibusdam? Cum, labore ullam
          voluptatibus similique dolore enim ipsa explicabo doloribus, quam rem
          quis porro iure optio odio. Numquam aperiam alias illo commodi dolorum
          consectetur blanditiis illum deserunt quas minus in amet molestiae
          possimus accusamus aliquam nam dolor fugiat eligendi, iusto soluta a
          impedit. Sapiente deleniti totam iste eaque unde, at nesciunt
          consectetur repellat magnam quia laudantium provident similique
          eveniet doloribus optio velit animi facere excepturi quis et,
          inventore eligendi. Doloribus, rem deserunt debitis nulla maiores
          aliquid vel aut qui exercitationem. Suscipit a voluptatem fuga nobis
          eum perspiciatis saepe incidunt quas repellat, quisquam rerum quidem
          eligendi omnis cumque inventore ullam alias atque unde, ducimus iure.
          Itaque natus error vel dolor nisi quae aut aliquid, libero similique.
          Iusto laudantium possimus quisquam necessitatibus odit consectetur
          ratione eaque voluptatum atque labore, debitis provident! Voluptate
          veritatis inventore sit fuga dolorem. Praesentium earum pariatur
          placeat quidem ducimus.
        </div>
        <div className="col-span-3">
          <div className="sticky top-[34px]">
            <CheckoutCard cartId={props.params.cartId.toString()} />
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default page;
