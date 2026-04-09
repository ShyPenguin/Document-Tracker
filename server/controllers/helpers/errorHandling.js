export const errorMaximumRequired = (err) => {
  const firstError = Object.values(err.errors)[0];
  if (firstError.kind === "required") {
    return `The ${firstError.path} is missing`;
  }

  if (firstError.kind === "maxlength") {
    return `The ${firstError.path} exceeded the maximum length (${firstError.properties.maxlength})`;
  }

  if (firstError.kind === "enum") {
    return `The ${firstError.path}: ${firstError.value} is not a valid role`;
  }
};

export const errorUnique = (err) => {
  const key = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];
  return `The ${key}: ${value} already exists!`;
};

export const errorId = (err, action) => {
  const value = err.value;
  const model = err.model.modelName;

  return action === "Delete"
    ? `The ${model} you trying to delete does not exist!`
    : `The ${model} with ID ${value} does not exists!`;
};
