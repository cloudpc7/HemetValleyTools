import { Form } from "react-bootstrap";
import { Formik } from "formik";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../styles/components/header/header.scss";

library.add(fab, fas);

const Search = () => {
  const handleChange = (event, formikHandleChange) => {
    formikHandleChange(event);
    console.log("Search term:", event.target.value); 
  };

  return (
    <Formik
      initialValues={{
        searchTerm: "",
      }}
    >
      {({ values, handleChange: formikHandleChange, handleBlur }) => (
        <Form noValidate className="search-input d-flex align-items-center">
          <FontAwesomeIcon icon={['fas', 'magnifying-glass']} size="1x" className="search-icon me-2" />
          <Form.Control
            type="text"
            name="searchTerm"
            placeholder="Search"
            value={values.searchTerm}
            onChange={(event) => handleChange(event, formikHandleChange)}
            onBlur={handleBlur}
            className="
              search 
              border-top-0 
              border-start-0
              border-end-0
              rounded-0
              bg-transparent
              mb-3
            "
          />
        </Form>
      )}
    </Formik>
  );
};

export default Search;