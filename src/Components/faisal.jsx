// প্রয়োজনীয় প্যাকেজগুলি ইম্পোর্ট করা
const express = require('express'); // Express.js ওয়েব ফ্রেমওয়ার্ক
const cors = require('cors'); // CORS সক্রিয় করতে ব্যবহৃত হয়
require('dotenv').config(); // পরিবেশ ভেরিয়েবলগুলি লোড করতে ব্যবহৃত হয়
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // MongoDB ক্লায়েন্ট এবং অন্যান্য প্রয়োজনীয় ক্লাসগুলি ইম্পোর্ট করা হয়

const app = express(); // Express অ্যাপ্লিকেশন ইনস্ট্যান্স তৈরি করা হয়
const port = process.env.PORT || 5000; // সার্ভারটি কোন পোর্টে চলবে তা নির্ধারণ করা হয়

// Middleware সেটআপ
app.use(cors()); // CORS সক্রিয় করা হয়
app.use(express.json()); // ইনকামিং JSON ডেটা পার্স করতে ব্যবহৃত হয়

// MongoDB সংযোগ স্ট্রিং এবং ক্লায়েন্ট তৈরি
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8kzkr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// MongoDB সার্ভারের সাথে সংযোগ এবং রাউটগুলি সেটআপ
async function run() {
  try {
    // সার্ভারের সাথে সংযোগ স্থাপন করা (v4.7 থেকে ঐচ্ছিক)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee');

    // সমস্ত কফি ডেটা ফেরত দেয়
    app.get('/coffee', async (req, res) => {
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // নির্দিষ্ট আইডির কফি ডেটা ফেরত দেয়
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // নতুন কফি ডেটা যোগ করে
    app.post('/coffee', async (req, res) => {
      const newCoffee = req.body;
      console.log(JSON.stringify(newCoffee));
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    // নির্দিষ্ট আইডির কফি ডেটা আপডেট করে
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = req.body;
      const coffee = {
        $set: {
          name: updateCoffee.name,
          quantity: updateCoffee.quantity,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photo: updateCoffee.photo,
        },
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    });

    // নির্দিষ্ট আইডির কফি ডেটা মুছে ফেলে
    app.delete('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });

    // সফল সংযোগ নিশ্চিত করতে একটি পিং পাঠানো
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // নিশ্চিত করে যে ক্লায়েন্টটি বন্ধ হবে যখন আপনি শেষ করবেন/ত্রুটি হবে
    // await client.close();
  }
}
run().catch(console.dir);

// মূল রুট যা একটি বার্তা ফেরত দেয়
app.get('/', (req, res) => {
  res.send('Coffee making server is running');
});

// সার্ভারটি নির্দিষ্ট পোর্টে লিসেন করে
app.listen(port, () => {
  console.log(`Coffee Server is running on port: ${port}`);
});
// server site ses

// client site shuru
// app.jsx
import { useLoaderData } from 'react-router-dom'; // React Router থেকে ডেটা লোড করার জন্য ব্যবহৃত হয়
import './App.css'; // CSS ফাইল ইম্পোর্ট করা হয়
import CoffeeCard from './Components/CoffeeCard'; // CoffeeCard কম্পোনেন্ট ইম্পোর্ট করা হয়
import { useState } from 'react'; // React এর useState হুক ইম্পোর্ট করা হয়

function App() {
  const loadedCoffees = useLoaderData(); // React Router থেকে লোড করা ডেটা পাওয়া হয়
  const [coffees, setCoffees] = useState(loadedCoffees); // useState হুক ব্যবহার করে coffees স্টেট সেট করা হয়

  return (
    <div className='m-20'>
      <h1 className='text-6xl text-center my-20 text-purple-600'>
        Hot Hot Cold Coffee: {coffees.length} {/* কফির সংখ্যা প্রদর্শন করা হয় */}
      </h1>
      <div className='grid md:grid-cols-2 gap-4'>
        {coffees.map(coffee => (
          <CoffeeCard
            key={coffee._id}
            coffee={coffee}
            coffees={coffees}
            setCoffees={setCoffees}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

// main.jsx
import { StrictMode } from "react"; // React এর StrictMode কম্পোনেন্ট ইম্পোর্ট করা হয়, যা ডেভেলপমেন্ট মোডে অতিরিক্ত চেক এবং সতর্কতা সক্রিয় করে।
import { createRoot } from "react-dom/client"; // React 18 এর createRoot ফাংশন ইম্পোর্ট করা হয়, যা রুট রেন্ডারিং API।
import "./index.css"; // CSS ফাইল ইম্পোর্ট করা হয়।
import App from "./App.jsx"; // App কম্পোনেন্ট ইম্পোর্ট করা হয়।
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // React Router এর createBrowserRouter এবং RouterProvider ইম্পোর্ট করা হয়।
import AddCoffee from "./Components/AddCoffee.jsx"; // AddCoffee কম্পোনেন্ট ইম্পোর্ট করা হয়।
import UpdateCoffee from "./Components/UpdateCoffee.jsx"; // UpdateCoffee কম্পোনেন্ট ইম্পোর্ট করা হয়।

// রাউটার কনফিগারেশন
const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>, // মূল রুটে App কম্পোনেন্ট রেন্ডার করা হয়।
    loader: () => fetch('http://localhost:5000/coffee') // App কম্পোনেন্ট লোড করার সময় ডেটা ফেচ করা হয়।
  },
  {
    path: "addCoffee",
    element: <AddCoffee></AddCoffee>, // addCoffee রুটে AddCoffee কম্পোনেন্ট রেন্ডার করা হয়।
  },
  {
    path: "updateCoffee/:id",
    element: <UpdateCoffee></UpdateCoffee>, // updateCoffee রুটে UpdateCoffee কম্পোনেন্ট রেন্ডার করা হয়।
    loader: ({params}) => fetch(`http://localhost:5000/coffee/${params.id}`) // UpdateCoffee কম্পোনেন্ট লোড করার সময় নির্দিষ্ট আইডির ডেটা ফেচ করা হয়।
  },
]);

// রুট রেন্ডার করা
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} /> // RouterProvider এর মাধ্যমে রাউটার প্রদান করা হয়।
  </StrictMode>
);

// addcoffee.jsx
import { Link } from "react-router-dom"; // React Router থেকে Link কম্পোনেন্ট ইম্পোর্ট করা হয়
import { FaArrowLeftLong } from "react-icons/fa6"; // React Icons থেকে FaArrowLeftLong আইকন ইম্পোর্ট করা হয়
import Swal from "sweetalert2"; // SweetAlert2 ইম্পোর্ট করা হয়, যা সুন্দর এলার্ট মেসেজ প্রদর্শন করতে ব্যবহৃত হয়

const AddCoffee = () => {
  const handleAddCoffee = (event) => {
    event.preventDefault(); // ফর্ম সাবমিটের ডিফল্ট বিহেভিয়ার বন্ধ করা হয়

    const form = event.target;

    // ফর্মের মানগুলি অ্যাক্সেস করা হয়
    const name = form.name.value;
    const quantity = form.quantity.value;
    const supplier = form.supplier.value;
    const taste = form.taste.value;
    const category = form.category.value;
    const details = form.details.value;
    const photo = form.photo.value;

    const newCoffee = {
      name,
      quantity,
      supplier,
      taste,
      category,
      details,
      photo,
    };
    console.log(newCoffee);

    // সার্ভারে ডেটা পাঠানো হয়
    fetch("http://localhost:5000/coffee", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newCoffee),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.insertedId) {
          Swal.fire({
            title: "success",
            text: "Coffee Added Successfully",
            icon: "success",
            confirmButtonText: "Cool",
          });
        }
      });
  };

  return (
    <div>
      <div>
        <Link to="/" className="font-rancho font-bold text-lg flex">
          <FaArrowLeftLong className="mr-3 ml-2 mt-1" />
          Back To home
        </Link>
      </div>
      <div className="bg-[#F4F3F0] p-24">
        <h2 className="text-3xl text-center font-extrabold font-rancho text-[#374151] mb-5">
          Add a Coffee
        </h2>
        <p className="text-center text-sm text-gray-500 mb-5">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at <br />
          its layout. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, as opposed <br />
          to using Content here.
        </p>
        <form onSubmit={handleAddCoffee}>
          {/* ফর্মের নাম এবং পরিমাণের সারি */}
          <div className="md:flex mb-8">
            <div className="form-control md:w-1/2">
              <label className="label">
                <span className="label-text">Coffee Name</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Coffee Name"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="form-control md:w-1/2 ml-4">
              <label className="label">
                <span className="label-text">Available Quantity</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  name="quantity"
                  placeholder="Available Quantity"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
          </div>

          {/* ফর্মের সরবরাহকারী এবং স্বাদের সারি */}
          <div className="md:flex mb-8">
            <div className="form-control md:w-1/2">
              <label className="label">
                <span className="label-text">Supplier Name</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  name="supplier"
                  placeholder="Supplier Name"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="form-control md:w-1/2 ml-4">
              <label className="label">
                <span className="label-text">Taste</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  name="taste"
                  placeholder="Taste"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
          </div>

          {/* ফর্মের ক্যাটেগরি এবং বিবরণের সারি */}
          <div className="md:flex mb-8">
            <div className="form-control md:w-1/2">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
            <div className="form-control md:w-1/2 ml-4">
              <label className="label">
                <span className="label-text">Details</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  name="details"
                  placeholder="Details"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
          </div>

          {/* ফর্মের ফটো URL সারি */}
          <div className="mb-8">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Photo URL</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  name="photo"
                  placeholder="Photo URL"
                  className="input input-bordered w-full"
                />
              </label>
            </div>
          </div>

          <input
            type="submit"
            value="Add Coffee"
            className="btn btn-block bg-[#D2B48C] font-rancho"
          />
        </form>
      </div>
    </div>
  );
};

export default AddCoffee;

// coffeecard
import { Link } from "react-router-dom"; // React Router থেকে Link কম্পোনেন্ট ইম্পোর্ট করা হয়
import Swal from "sweetalert2"; // SweetAlert2 ইম্পোর্ট করা হয়, যা সুন্দর এলার্ট মেসেজ প্রদর্শন করতে ব্যবহৃত হয়
import { IoMdEye } from "react-icons/io"; // React Icons থেকে IoMdEye আইকন ইম্পোর্ট করা হয়
import { IoPencil } from "react-icons/io5"; // React Icons থেকে IoPencil আইকন ইম্পোর্ট করা হয়
import { MdOutlineDelete } from "react-icons/md"; // React Icons থেকে MdOutlineDelete আইকন ইম্পোর্ট করা হয়

const CoffeeCard = ({ coffee, coffees, setCoffees }) => {
  const { name, quantity, supplier, taste, category, details, photo, _id } = coffee; // coffee অবজেক্ট থেকে প্রয়োজনীয় প্রপার্টি ডিকন্সট্রাক্ট করা হয়

  const handleDelete = (id) => {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/coffee/${_id}`, {
          method: 'DELETE'
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data.deletedCount > 0) {
              Swal.fire({
                title: "Deleted!",
                text: "Your Coffee has been deleted.",
                icon: "success",
              });
              const remaining = coffees.filter(cof => cof._id !== _id); // অবশিষ্ট কফি ফিল্টার করা হয়
              setCoffees(remaining); // স্টেট আপডেট করা হয়
            }
          });
      }
    });
  };

  return (
    <div className="card card-side bg-[#ECEAE3] shadow-xl">
      <figure>
        <img src={photo} alt="" /> {/* কফির ছবি প্রদর্শন করা হয় */}
      </figure>
      <div className="flex justify-between w-full pr-4">
        <div>
          <h2 className="card-title mt-10">Name: {name}</h2> {/* কফির নাম প্রদর্শন করা হয় */}
          <p>{quantity}</p> {/* কফির পরিমাণ প্রদর্শন করা হয় */}
          <p>{supplier}</p> {/* সরবরাহকারীর নাম প্রদর্শন করা হয় */}
          <p>{taste}</p> {/* কফির স্বাদ প্রদর্শন করা হয় */}
        </div>
        <div className="card-actions justify-end">
          <div className="join join-vertical">
            <button className="btn btn-xs mb-8 mt-5 bg-[#D2B48C]"><IoMdEye /></button> {/* দেখার বাটন */}
            <Link to={`updateCoffee/${_id}`}>
              <button className="btn btn-xs bg-black text-white mb-8"><IoPencil /></button> {/* আপডেট করার বাটন */}
            </Link>
            <button
              onClick={() => handleDelete(_id)}
              className="btn btn-xs bg-[#EA4744]"
            >
              <MdOutlineDelete /> {/* মুছে ফেলার বাটন */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeCard;

// updatecoffee
import { useLoaderData } from "react-router-dom"; // React Router থেকে useLoaderData হুক ইম্পোর্ট করা হয়
import Swal from "sweetalert2"; // SweetAlert2 ইম্পোর্ট করা হয়, যা সুন্দর এলার্ট মেসেজ প্রদর্শন করতে ব্যবহৃত হয়

const UpdateCoffee = () => {
  const coffee = useLoaderData(); // React Router থেকে লোড করা ডেটা পাওয়া হয়
  const { name, quantity, supplier, taste, category, details, photo, _id } = coffee; // coffee অবজেক্ট থেকে প্রয়োজনীয় প্রপার্টি ডিকন্সট্রাক্ট করা হয়

  const handleUpdateCoffee = (event) => {
    event.preventDefault(); // ফর্ম সাবমিটের ডিফল্ট বিহেভিয়ার বন্ধ করা হয়

    const form = event.target;

    // ফর্মের মানগুলি অ্যাক্সেস করা হয়
    const name = form.name.value;
    const quantity = form.quantity.value;
    const supplier = form.supplier.value;
    const taste = form.taste.value;
    const category = form.category.value;
    const details = form.details.value;
    const photo = form.photo.value;

    const updatedCoffee = {
      name,
      quantity,
      supplier,
      taste,
      category,
      details,
      photo,
    };
    console.log(updatedCoffee);

    // সার্ভারে ডেটা পাঠানো হয়
    fetch(`http://localhost:5000/coffee/${_id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(updatedCoffee),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.modifiedCount > 0) {
          Swal.fire({
            title: "success",
            text: "Coffee Updated Successfully",
            icon: "success",
            confirmButtonText: "Cool",
          });
        }
      });
  };

  return (
    <div className="bg-[#F4F3F0] p-24">
      <h2 className="text-3xl text-center font-extrabold font-rancho text-[#374151] mb-5">
        Update Existing Coffee Details
      </h2>
      <p className="text-center text-sm text-gray-500 mb-5">
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at <br />
        its layout. The point of using Lorem Ipsum is that it has a
        more-or-less normal distribution of letters, as opposed <br />
        to using Content here.
      </p>
      <form onSubmit={handleUpdateCoffee}>
        {/* ফর্মের নাম এবং পরিমাণের সারি */}
        <div className="md:flex mb-8">
          <div className="form-control md:w-1/2">
            <label className="label">
              <span className="label-text">Coffee Name</span>
            </label>
            <label className="input-group">
              <input
                type="text"
                name="name"
                defaultValue={name}
                placeholder="Coffee Name"
                className="input input-bordered w-full"
              />
            </label>
          </div>
          <div className="form-control md:w-1/2 ml-4">
            <label className="label">
              <span className="label-text">Available Quantity</span>
            </label>
            <label className="input-group">
              <input
                type="text"
                name="quantity"
                defaultValue={quantity}
                placeholder="Available Quantity"
                className="input input-bordered w-full"
              />
            </label>
          </div>
        </div>

        {/* ফর্মের সরবরাহকারী এবং স্বাদের সারি */}
        <div className="md:flex mb-8">
          <div className="form-control md:w-1/2">
            <label className="label">
              <span className="label-text">Supplier Name</span>
            </label>
            <label className="input-group">
              <input
                type="text"
                name="supplier"
                defaultValue={supplier}
                placeholder="Supplier Name"
                className="input input-bordered w-full"
              />
            </label>
          </div>
          <div className="form-control md:w-1/2 ml-4">
            <label className="label">
              <span className="label-text">Taste</span>
            </label>
            <label className="input-group">
              <input
                type="text"
                name="taste"
                defaultValue={taste}
                placeholder="Taste"
                className="input input-bordered w-full"
              />
            </label>
          </div>
        </div>

        {/* ফর্মের ক্যাটেগরি এবং বিবরণের সারি */}
        <div className="md:flex mb-8">
          <div className="form-control md:w-1/2">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <label className="input-group">
              <input
                type="text"
                name="category"
                defaultValue={category}
                placeholder="Category"
                className="input input-bordered w-full"
              />
            </label>
          </div>
          <div className="form-control md:w-1/2 ml-4">
            <label className="label">
              <span className="label-text">Details</span>
            </label>
            <label className="input-group">
              <input
                type="text"
                name="details"
                defaultValue={details}
                placeholder="Details"
                className="input input-bordered w-full"
              />
            </label>
          </div>
        </div>

        {/* ফর্মের ফটো URL সারি */}
        <div className="mb-8">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Photo URL</span>
            </label>
            <label className="input-group">
              <input
                type="text"
                name="photo"
                defaultValue={photo}
                placeholder="Photo URL"
                className="input input-bordered w-full"
              />
            </label>
          </div>
        </div>

        <input
          type="submit"
          value="Update Coffee Details"
          className="btn btn-block bg-[#D2B48C] font-rancho"
        />
      </form>
    </div>
  );
};

export default UpdateCoffee;


