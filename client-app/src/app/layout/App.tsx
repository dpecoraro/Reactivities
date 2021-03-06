import React, { Fragment, useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../feature/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, Switch, useLocation } from "react-router-dom";
import HomePage from "../../feature/home/HomePage";
import ActivityForm from "../../feature/activities/form/ActivityForm";
import ActivityDetails from "../../feature/activities/details/ActivityDetails";
import TestErrors from "../../feature/errors/TestError";
import { ToastContainer } from "react-toastify";
import NotFound from "../../feature/errors/NotFound";
import ServerError from "../../feature/errors/ServerError";
import LoginForm from "../../feature/users/LoginForm";
import ModalContainer from "../common/modals/modalContainer";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [userStore, commonStore]);

  if (!commonStore.appLoaded) return <LoadingComponent content="Loading .." />;

  return (
    <Fragment>
      <ToastContainer position="bottom-right" hideProgressBar />
      <ModalContainer />
      <Route exact path="/" component={HomePage} />

      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />

            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <Route path="/errors" component={TestErrors} />
                <Route path="/server-error" component={ServerError} />
                <Route path="/login" component={LoginForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
}

export default observer(App);
