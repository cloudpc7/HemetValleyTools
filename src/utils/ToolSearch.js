import { Form } from "react-bootstrap";
import { Formik } from "formik";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "../styles/toolsearch/toolsearch.scss";

library.add(fab, fas);

const ToolSearch = () => {
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
        <Form noValidate className="d-flex align-items-center p-3 search-input">
          <FontAwesomeIcon icon={['fas', 'magnifying-glass']} size="1x" className="search-icon me-2" />
          <Form.Control
            type="text"
            name="searchTerm"
            placeholder="Search"
            value={values.searchTerm}
            onChange={(event) => handleChange(event, formikHandleChange)}
            onBlur={handleBlur}
            className="
              rounded-0
              search 
            "
          />
        </Form>
      )}
    </Formik>
  );
};

export default ToolSearch;