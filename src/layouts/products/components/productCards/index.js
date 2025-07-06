import * as React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import IMAGE1 from "../../../../assets/images/product3.png";
import IMAGE2 from "../../../../assets/images/product2.png";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "store/loginSlice";
import { setInitialData } from "store/fileUploadSlice";

const ResponsiveCard = ({ image, title, description, buttonText, onClick, isFirst }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        width: isMobile ? "90vw" : 420,
        margin: "auto",
        mt: isMobile ? (isFirst ? 10 : 4) : 6,
        borderRadius: 3,
        boxShadow: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          height: isMobile ? 320 : 320,
          objectFit: "cover",
        }}
        image={image}
        alt={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClick} disabled={!onClick}>
          {buttonText}
        </Button>
      </CardActions>
    </Card>
  );
};

export function Onquer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.login);
  return (
    <ResponsiveCard
      image={IMAGE1}
      title="Onquer"
      description="A specialized genome-informatics solution designed to analyze germline samples inherited from parents. Onquer focuses on identifying mutations linked to hereditary disorders."
      buttonText="Explore"
      onClick={() => {
        dispatch(addProduct("Onquer"));
        dispatch(setInitialData({ product: "Onquer", email: user.email }));
        navigate("/dashboard");
      }}
      isFirst={true}
    />
  );
}

export function InheriGene() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.login);
  return (
    <ResponsiveCard
      image={IMAGE2}
      title="Inherigene"
      description="A specialized genome-informatics solution designed to analyze germline samples inherited from parents. InheriGene helps identify mutations associated with hereditary disorders."
      buttonText="Explore"
      onClick={() => {
        dispatch(addProduct("Inherigene"));
        dispatch(setInitialData({ product: "Inherigene", email: user.email }));
        navigate("/dashboard");
      }}
    />
  );
}
