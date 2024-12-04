import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

const UpdateCoffee = () => {

    const coffee = useLoaderData();
    const { name, quantity, supplier, taste, category, details, photo, _id } =
    coffee;

    
    const handleUpdateCoffee = (event) => {
      event.preventDefault();
  
      const form = event.target;
  
      // Access form values using their correct names
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
      // send data to the server
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
          {/* Form name and quantity row */}
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

          {/* Form supplier and taste row */}
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

          {/* Form category and details row */}
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

          {/* Form Photo URL row */}
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