import { z } from "zod";
import categories from "../Category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../Firebase";

const expenseCollection = collection(db, "expense");

const schema = z.object({
  Description: z
    .string()
    .min(3, { message: "Input atleast Three Character" })
    .max(30),
  Amount: z.number().min(2, { message: "Too low" }).max(10000000000000),
  Category: z.enum(categories, {
    errorMap: () => ({ message: "Category is Required" }),
  }),
});

type FormData = z.infer<typeof schema>;

const Inputfield = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const date = new Date();
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      // Use addDoc to add a document to the Firestore collection
      await addDoc(expenseCollection, {
        description: data.Description,
        amount: data.Amount,
        category: data.Category,
        date: formattedDate,
      });

      console.log("Document added successfully");
    } catch (error) {
      console.error("Error adding document: ", error);
      // Handle errors or provide user feedback
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="mb-3">
          <label htmlFor="Description" className="form-label">
            <strong>Description</strong>
          </label>
          <input
            id="Description"
            {...register("Description")}
            type="text"
            className="form-control"
          />
          {errors.Description && (
            <p className="text-danger">{errors.Description.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="Amount" className="form-label">
            <strong>Amount</strong>
          </label>
          <input
            type="number"
            className="form-control"
            id="Amount"
            placeholder="Example input placeholder"
            {...register("Amount", { valueAsNumber: true })}
          />
          {errors.Amount && (
            <p className="text-danger">{errors.Amount.message}</p>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="Category" className="form-label">
            <strong>Category</strong>
          </label>
          <select
            className="form-control"
            id="Category"
            {...register("Category")}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.Category && (
            <p className="text-danger">{errors.Category.message}</p>
          )}
        </div>
      </div>
      <button className="btn btn-primary" type="submit">
        Submit
      </button>
    </form>
  );
};

export default Inputfield;
