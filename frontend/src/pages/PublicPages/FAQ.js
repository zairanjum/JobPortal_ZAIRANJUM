
import { useLocation } from "react-router-dom";

const FAQ = () => {
  const { pathname } = useLocation();
  const url = "/client/faqs";
  const url2 = "/freelancer/faqs";

  return (
    <div>
      <div
        className={
          pathname.includes(url) || pathname.includes(url2)
            ? "bg-lightblue py-9 px-4"
            : "bg-lightblue py-40 lg:py-24 px-4"
        }
      >
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row ">
          <h2 className="mr-8 w-full md:w-1/3 text-3xl font-extrabold leading-9 mb-8">
            Frequently-asked questions
          </h2>
          <dl className="w-full md:w-2/3">
            <dt className="mb-4">
              <h3 className="text-xl font-semibold">
                We already have ongoing projects. Will Valohai easily integrate
                with them?
              </h3>
            </dt>
            <dd className="mb-16">
              <p>
                Running existing machine learning projects in Valohai is very
                simple! Integration only requires adding a valohai.yaml
                configuration file. Moving projects in and out of Valohai is
                easy – the integration is only the configuration file.
              </p>
            </dd>
            <dt className="mb-4">
              <h3 className="text-xl font-semibold">
                How do you compare to other data science platforms?
              </h3>
            </dt>
            <dd className="mb-16">
              <p>
                We don’t. Valohai isn’t a data science platform; it&#x27;s a
                Machine Learning Management Platform that handles the whole ML
                pipeline from feature extraction, to training of your model and
                to deploying it into production in a reproducible manner. Data
                science platforms offer hosted notebooks and AutoML solutions.
              </p>
            </dd>
            <dt className="mb-4">
              <h3 className="text-xl font-semibold">
                Does Valohai charge for computation?
              </h3>
            </dt>
            <dd className="mb-16">
              <p>
                Depends. Most of our customers use their own cloud and thus pay
                for usage according to their own agreements. Valohai
                doesn&#x27;t charge anything on top of the per-user license fee.
                If you don&#x27;t have a cloud provider, you can use our AWS,
                GCP and Azure accounts, and we&#x27;ll only charge you for what
                you use.
              </p>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
