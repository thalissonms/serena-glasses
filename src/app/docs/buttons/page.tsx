import Buttons from "@/components/ui/button";
import { Share2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import HeroHeader from "./Header";

interface item {
  name: string;
  price: string;
  img: string;
}

const items: item[] = [
  { name: "Óculos de Sol", price: "R$ 89,90", img: "5.jpg" },
  { name: "Óculos de Verão", price: "R$ 124,90", img: "2.jpg" },
  { name: "Óculos de Grau", price: "R$ 49,90", img: "3.jpg" },
  { name: "Óculos Juliete", price: "R$ 179,90", img: "6.jpg" },
  { name: "Óculos de Leitura", price: "R$ 139,90", img: "6.jpg" },
  {name:"Teste", price:"Julia", img: "2.jpg"}
];

const ButtonsPage = () => {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
      <HeroHeader />
      <div className="flex flex-wrap justify-center gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group flex flex-col justify-between w-[320px] sm:w-[360px] h-[520px] rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-1000 relative border border-pink-300"
          >
            <div className="absolute top-0 right-0 m-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/80 hover:bg-black hover:shadow-lg transition">
                <Share2 className="text-white" size={18} />
              </button>
            </div>

            <div className="flex justify-center pt-4">
              <Image
                alt="Serena Glasses"
                src="/sublogo.png"
                width={30}
                height={30}
              />
            </div>

            <div className="flex justify-center px-4">
              <Image
                alt="Óculos Serena"
                src={`/${item.img}`}
                width={260}
                height={280}
                className="border rounded-md cursor-pointer"
              />
            </div>

            <div className="mx-4 my-3 h-[1.5px] bg-pink-200 rounded-full" />

            <div className="flex flex-col items-center px-4 pb-4">
              <h1 className="text-lg font-semibold text-black">{item.name}</h1>
              <h2 className="text-xl font-bold text-primary mb-4">
                {item.price}
              </h2>

              <div className="w-full flex gap-2">
                <Buttons text="Comprar Agora" className="flex-1" />
                <button className="w-12 h-12 flex items-center justify-center rounded-md cursor-pointer bg-black hover:bg-black/85 transition hover:shadow-md">
                  <ShoppingBag className="text-white" size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ButtonsPage;
