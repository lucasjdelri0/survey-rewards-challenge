import React from "react";
import { Breadcrumb, Layout } from "antd";
import Header from "components/layout/Header";
import { PageProps } from "./Page.props";
import "./Page.css";

const { Content, Footer } = Layout;

export const Page = (props: PageProps): JSX.Element => (
  <Layout>
    <Header
      backgroundColor="white"
      repoHref="https://github.com/lucasjdelri0/survey-rewards-challenge"
      avatarImageSrc="https://joeschmoe.io/api/v1/random"
    />
    <Content
      className="site-layout"
      style={{ padding: "0 50px", marginTop: 64 }}
    >
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className="site-layout-background"
        style={{ padding: 24, minHeight: 380 }}
      >
        {props.children}
      </div>
    </Content>
    <Footer style={{ textAlign: "center" }}>
      Survey Challenge for Rather Labs (2022)
    </Footer>
  </Layout>
);
