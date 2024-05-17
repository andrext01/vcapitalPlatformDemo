import { CUstomSelect } from "components/common/CUstomSelect";
import { useEffect, useState } from "react";
import { BsQuestionSquareFill } from "react-icons/bs";

export const AddPostThree = ({
  setAddStep,
  terms,
  setTerms,
  auto_reply,
  setAuto_reply,
  data,
  selectedCountry,
  setSelectedCountry,
  uid,
  registerDays,
  coinHolding,
  setregisterDays,
  setcoinHolding,
  createUpdateP2pAdsAction,
  UpdateP2pAdsAction,
}: any) => {
  const [Countries, setCountries] = useState([]);
  const handleCountry = (e: any) => {
    setSelectedCountry(e);
  };
  useEffect(() => {
    let country: any = [];
    data?.data?.country?.map((asset: any) => {
      const obj = {
        value: asset.key,
        label: asset.key,
      };
      country.push(obj);
    });
    setCountries(country);
  }, [data.data.payment_method, data.data.payment_time]);
  return (
    <div className="col-12 mt-4">
      <div className="buySellAddBox px-4 py-5 rounded">
        <div className="row">
          <div className="col-md-6">
            <label> Terms [Optional]</label>
            <div className="P2psearchBox position-relative">
              <textarea
                placeholder="Terms will be displayed the counterparty"
                value={terms}
                onChange={(e) => {
                  setTerms(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <label> Auto-reply [Optional]</label>
            <div className="P2psearchBox position-relative">
              <textarea
                placeholder="Terms will be displayed the counterparty"
                value={auto_reply}
                onChange={(e) => {
                  setAuto_reply(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
          <div className="col-12 mt-4">
            <label className="d-block pb-0 mb-0">Counterparty Conditions</label>
            <span>
              Adding counterparty requirements will reduce the exposure of your
              Ad
            </span>
            <div className="row">
              <div className="col-md-6 col-lg-3 mt-3">
                <div className="adFromCheckBox">
                  <p>Register days</p>
                  <input
                    type="number"
                    value={registerDays}
                    className="pricePoint_field"
                    onChange={(e) => {
                      setregisterDays(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-6 col-lg-3 mt-3">
                <div className="adFromCheckBox">
                  <p>Coin holding</p>
                  <input
                    type="number"
                    value={coinHolding}
                    className="pricePoint_field"
                    onChange={(e) => {
                      setcoinHolding(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <label className="mt-4">Available Region[s]</label>
            <div className="col-md-3 p-0">
              <CUstomSelect
                options={Countries}
                isSearchable={true}
                isMulti={true}
                placeholder="All Region[s]"
                handleFunction={handleCountry}
                defaultValue={selectedCountry}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 adFromHelp">
        <a href="">
          <BsQuestionSquareFill className="shadow" />
          Help & Guide
        </a>
      </div>
      <div className="addPostNextButton mt-3">
        <p></p>
        <div>
          <button onClick={() => setAddStep("stepTwo")} className=" py-2">
            Previous
          </button>
          <button
            className=" py-2 buySellBoxActive ml-2"
            onClick={uid ? UpdateP2pAdsAction : createUpdateP2pAdsAction}
          >
            {uid ? "Edit" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
