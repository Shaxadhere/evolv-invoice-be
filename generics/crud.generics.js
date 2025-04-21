import { defaultFilter } from "../constants/listing.constants.js";
import { ApiResponse, errorHandler } from "../utils/response.utils.js";

//get all students, use aggregate paginate, use size and page query params, use sort query param, use search query param

export function getAll(model, req, res, query = {}, searchableFields = []) {
  let {
    size = defaultFilter?.size,
    page = defaultFilter?.page,
    sort = defaultFilter?.sort,
    order = defaultFilter?.order,
    search,
    ...rest
  } = req.query;

  const restQuery = { ...rest };
  const restQueryKeys = Object.keys(restQuery)

  console.log(restQuery, "'")
  size = Number(size);
  page = Number(page);
  const sortOrder = order === "asc" ? 1 : -1;

  if (search) {
    query.$or = searchableFields.map((field) => {
      if (field === "invoiceNumber" && !isNaN(Number(search))) {
        return { [field]: Number(search) };
      }
      return {
        [field]: { $regex: search, $options: "i" },
      };
    });
  }
  if (restQueryKeys.length > 0) {
    query.$and = restQueryKeys.map((key) => {
      const values = restQuery[key].split(",");
      const _values = values.map((value)=> {
          if (key === "invoiceNumber") {
            return { [key]: Number(value) };
          }
          return { [key]: { $regex: value, $options: "i" } };
      })
      return { [key]: { $in: values } };
      // return { [key]: { $regex: restQuery[key] } };
    });
  }
  model
    .aggregatePaginate(
      model.aggregate([
        { $match: query },
        { $sort: { [sort]: sortOrder } },
      ]),
      {
        page,
        limit: size,
      }
    )
    .then((data) => {
      return res
        .status(200)
        .json(ApiResponse({ data, message: "Data fetched successfully" }));
    })
    .catch((err) => {
      return res
        .status(400)
        .json(ApiResponse({ message: errorHandler(err), status: false }));
    });
}

//get a single entity by id
export function getOne(model, req, res) {
  model.findById(req.params.id)
    .then((data) => {
      return res.status(200).json(ApiResponse({ data, message: "Entity fetched successfully" }));
    })
    .catch((err) => {
      return res.status(400).json(ApiResponse({ message: errorHandler(err), status: false }));
    });
}

//create a new entity
export function create(model, req, res) {
  const entity = new model(req.body);
  entity
    .save()
    .then((data) => {
      return res.status(200).json(ApiResponse({ data, message: "Entity created successfully" }));
    })
    .catch((err) => {
      return res.status(400).json(ApiResponse({ message: errorHandler(err), status: false }));
    });
}

//update a entity by id and return the updated entity
export function updateOne(model, req, res) {
  model.findByIdAndUpdate
    (req.params.id, req.body, {
      new: true,
      useFindAndModify: false,
    })
    .then((data) => {
      return res.status(200).json(ApiResponse({ data, message: "Entity updated successfully" }));
    })
    .catch((err) => {
      return res.status(400).json(ApiResponse({ message: errorHandler(err), status: false }));
    });
}

//update invoice status by id and return the updated invoice
export function updateStatus(model, req, res) {
  const { invoiceStatus } = req.body;
  console.log(invoiceStatus, "invoiceStatus")
  if (!invoiceStatus) {
    return res.status(400).json(ApiResponse({ message: "Status is required", status: false }));
  }
  model.findByIdAndUpdate(
    req.params.id,
    { invoiceStatus },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).json(ApiResponse({ message: "Invoice not found", status: false }));
      }
      return res.status(200).json(ApiResponse({ data, message: "Status updated successfully" }));
    })
    .catch((err) => {
      return res.status(400).json(ApiResponse({ message: errorHandler(err), status: false }));
    });
}

//delete a entity by id
export function deleteOne(model, req, res) {
  model.findByIdAndDelete(req.params.id)
    .then((data) => {
      if (!data) return res.status(404).json(ApiResponse({ message: "Entity not found", status: false }));
      return res.status(200).json(ApiResponse({ data, message: "Entity deleted successfully" }));
    })
    .catch((err) => {
      return res.status(400).json(ApiResponse({ message: errorHandler(err), status: false }));
    });
}


export function getFacet(model, req, res) {
  model
    .aggregate(
      [
        {
          $group: {
            _id: "$clientName",
            count: { $sum: 1 },
            id: { $first: "$_id" } // or use $min/$max/$last depending on your need
          }
        },
        {
          $project: {
            _id: 0,
            clientName: "$_id",
            count: 1,
            id: 1
          }
        }
      ])
    .then((data) => {
      return res
        .status(200)
        .json(ApiResponse({ data, message: "Data fetched successfully" }));
    })
    .catch((err) => {
      return res
        .status(400)
        .json(ApiResponse({ message: errorHandler(err), status: false }));
    });
}