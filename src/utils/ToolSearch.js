import { Form } from "react-bootstrap";
import { Formik } from "formik";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/toolsearch/toolsearch.scss";

library.add(fas);

const ToolSearch = () => {
  const handleChange = (event, formikHandleChange) => {
    formikHandleChange(event);
    console.log("Search term:", event.target.value);
  };

  return (
    <Formik initialValues={{ searchTerm: "" }}>
      {({ values, handleChange: formikHandleChange, handleBlur }) => (
        <Form className="search-input d-flex align-items-center p-2">
          <FontAwesomeIcon
            icon={["fas", "magnifying-glass"]}
            size="2x"
            className="search-icon me-3"
          />
          <Form.Control
            type="text"
            name="searchTerm"
            placeholder="Search Tools"
            value={values.searchTerm}
            onChange={(event) => handleChange(event, formikHandleChange)}
            onBlur={handleBlur}
            className="search py-2 px-3"
          />
        </Form>
      )}
    </Formik>
  );
};

export default ToolSearch;