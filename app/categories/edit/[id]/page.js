"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import CategoryForm from "@/components/CategoryForm";
import { apiService } from "@/lib/api";
import { Container, CircularProgress, Box, Alert } from "@mui/material";

export default function EditCategory() {
  const params = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategory();
  }, [params.id]);

  const loadCategory = async () => {
    try {
      const categories = await apiService.getCategories();
      const foundCategory = categories.find(
        (cat) => cat.id === parseInt(params.id)
      );
      if (foundCategory) {
        setCategory(foundCategory);
      } else {
        setError("Category not found");
      }
    } catch (err) {
      setError("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <AuthGuard>
      <CategoryForm category={category} />
    </AuthGuard>
  );
}
