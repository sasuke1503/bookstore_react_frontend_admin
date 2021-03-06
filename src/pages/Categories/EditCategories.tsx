import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Input, message, Select, Spin, Image } from "antd";
import { useForm } from "antd/lib/form/Form";
import { ChangeEvent, useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../components/PageTitle/PageTitle";
import { APP_API } from "../../httpClient/config";
import { httpClient } from "../../httpClient/httpServices";
import { AddBookForm } from "../../models/addBook";
import { Category } from "../../models/book";
import { adminRoutes } from "../../routes/routes";
import "./Categories";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */

/* eslint-enable no-template-curly-in-string */

const EditCategories = () => {
  const [cateForm] = useForm();
  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      httpClient()
        .get(APP_API.getCategory.replace(":id", id))
        .then((res) => {
          console.log(res);
          cateForm.setFieldsValue(res.data);
          setImages([{ dataURL: res.data.image }]);
          setCurrentedImages([res.data.image]);
          setName(res.data.nameCategory);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const [nameCategory, setName] = useState("");
  const nameInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ): void => {
    setName(event.target.value);
  };
  const [images, setImages] = useState([] as ImageListType);
  const [currentedImage, setCurrentedImages] = useState<string[]>([]);
  const maxNumber = 1;
  const imageList2 = [];
  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    setCurrentedImages([]);
    console.log(imageList, addUpdateIndex);
    for (let i = 0; i < imageList.length; i++) {
      imageList2.push(imageList[i].file);
    }
    setImages(imageList);
    // setFile1(imageList[0].file);
  };
  const onFinish = (values: any) => {
    console.log(values);
    const formData: FormData = new FormData();
    formData.append(
      "category",
      new Blob(
        [
          JSON.stringify({
            id,
            nameCategory,
            currentedImage: currentedImage[0],
          }),
        ],
        { type: "application/json" }
      )
    );
    console.log(images);
    for (let i = 0; i < images.length; i++) {
      console.log(images[i]);
      formData.append("file", images[i].file as string | Blob);
    }
    setSubmitting(true);
    httpClient()
      .post(APP_API.editCategory, formData)
      .then((res) => {
        console.log(res);
        message.success("C???p Nh???t Th??nh C??ng!");
        navigate(adminRoutes.categories);
      })
      .catch((err) => {
        console.error(err);
        message.error("C???p Nh???t Th???t B???i!");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Spin spinning={submitting}>
      <div className="address-background bg-white rounded-3">
        <PageTitle>S???a Danh M???c</PageTitle>

        <Form
          {...layout}
          form={cateForm}
          name="nest-messages"
          onFinish={onFinish}
        >
          <div className="site-layout-background d-flex align-items-center ">
            <div style={{ marginLeft: "200px" }}>
              <div style={{ width: "800px" }}>
                <span
                  style={{
                    fontSize: 16,

                    color: "#555555",
                  }}
                >
                  T??n Th??? Lo???i:
                </span>
              </div>
              <Form.Item
                className="form-item "
                name="nameCategory"
                rules={[{ required: true, message: "Nh???p T??n Danh M???c" }]}
              >
                <Input
                  style={{ width: "800px" }}
                  onChange={(e) => {
                    nameInputChange(e);
                  }}
                />
              </Form.Item>

              <span
                style={{
                  fontSize: 16,

                  color: "#555555",
                }}
              >
                H??nh ???nh Danh M???c:
              </span>
              <ImageUploading
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                }) => (
                  // write your building UI
                  <div className="upload__image-wrapper">
                    <div style={{ marginBottom: "10px" }}>
                      <Button
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        Th??m H??nh
                      </Button>
                      &nbsp;
                      <Button onClick={onImageRemoveAll}>X??a To??n B???</Button>
                    </div>

                    <div
                      className="d-flex"
                      style={{
                        minHeight: "120px",
                        border: "1px solid rgba(0,0,0,.1)",
                        padding: "10px",
                      }}
                    >
                      {imageList.map((image, index) => (
                        <div key={index} className=" pr-3">
                          <Image
                            src={image.dataURL}
                            alt=""
                            width={100}
                            height={100}
                            style={{ objectFit: "cover" }}
                          />
                          <div className="">
                            <Button onClick={() => onImageUpdate(index)}>
                              ?????i
                            </Button>
                            <Button onClick={() => onImageRemove(index)}>
                              G???
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ImageUploading>

              <div
                className="d-flex justify-content-end mt-3"
                style={{ width: "800px" }}
              >
                <Form.Item className="form-item ">
                  <Button
                    style={{ width: "100px" }}
                    type="primary"
                    htmlType="submit"
                  >
                    L??u
                  </Button>
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </Spin>
  );
};

export default EditCategories;
