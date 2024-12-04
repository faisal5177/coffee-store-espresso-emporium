import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { IoMdEye } from "react-icons/io";
import { IoPencil } from "react-icons/io5";
import { MdOutlineDelete } from "react-icons/md";

const CoffeeCard = ({ coffee, coffees, setCoffees }) => {
  const { name, quantity, supplier, taste, category, details, photo, _id } =
    coffee;

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
        fetch(`http://localhost:5000/coffee/${_id}`,{
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
              const remaining = coffees.filter(cof => cof._id !== _id);
              setCoffees(remaining);
            }
          });
      }
    });
  };

  return (
    <div className="card card-side bg-[#ECEAE3] shadow-xl">
      <figure>
        <img src={photo} alt="" />
      </figure>
      <div className="flex justify-between w-full pr-4">
        <div>
          <h2 className="card-title mt-10">Name: {name}</h2>
          <p>{quantity}</p>
          <p>{supplier}</p>
          <p>{taste}</p>
        </div>
        <div className="card-actions justify-end">
          <div className="join join-vertical">
            <button className="btn btn-xs mb-8 mt-5 bg-[#D2B48C]"><IoMdEye /></button>
            <Link to={`updateCoffee/${_id}`}>
            <button className="btn btn-xs bg-black text-white mb-8"><IoPencil /></button>
            </Link>
            <button
              onClick={() => handleDelete(_id)}
              className="btn btn-xs bg-[#EA4744]"
            >
              <MdOutlineDelete />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeCard;
