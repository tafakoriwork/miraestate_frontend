import { ChangeEvent, useEffect, useRef, useState } from "react";

interface Step {
  title: string;
  categoryId: string;
  previousStep: Function;
  nextStep: Function;
}

interface Category {
  id: number;
  title: string;
  price: string;
  parent_id: string;
  recursive_children: Category[];
}

function ExpertStep5({ title,  previousStep, nextStep, categoryId }: Step) {
  const [category, setCategory] = useState<Category>();
  const getCategory = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Successful response handling
        const data = await response.json();
        setCategory(data.category);
        
      } else {
        // Error handling
        console.error("Failed to fetch agents Title:", response.statusText);
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error("Error fetching agents Title:", error);
    }
  };


  useEffect(() => {
    getCategory();
  }, []);

  

  return (
    <div className="border p-5 rounded-md shadow min-h-[350px] w-full flex justify-between gap-3 flex-col items-center">
      <h2 className="text-center">{title}</h2>
      <div className="flex flex-col gap-2 w-full">
        {/* first */}
    
        <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md">
          <label
            htmlFor="fileInput"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
             هزینه کارشناسی قابل پرداخت:
          </label>
          <div className="flex items-center justify-center text-center w-full">
           {category?.price} تومان
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full">
        <button
          onClick={() => {
            previousStep();
          }}
          className={`cursor-pointer bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-700 hover:to-gray-900 text-white font-bold pt-2 pb-1 mt-1 px-4 rounded`}
        >
          مرحله قبل
        </button>

        <button
          onClick={() => {
            nextStep();
          }}
          className={`cursor-pointer  bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold pt-2 pb-1 mt-1 px-4 rounded`}
        >
          پرداخت
        </button>
      </div>
    </div>
  );
}

export default ExpertStep5;
