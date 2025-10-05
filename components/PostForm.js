"use client";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function PostForm({ post = null }) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    status: post?.status || "draft",
    categoryId: post?.categoryId || "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (post) {
        await apiService.updatePost(post.id, formData);
      } else {
        await apiService.createPost(formData);
      }
      router.push("/posts");
    } catch (err) {
      setError(err.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            {post ? "Edit Post" : "Create Post"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Post Title"
              name="title"
              autoComplete="title"
              autoFocus
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="slug"
              label="Slug"
              name="slug"
              autoComplete="slug"
              value={formData.slug}
              onChange={handleChange}
              helperText="Unique URL identifier"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                label="Category"
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
                required
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="content"
              label="Content"
              name="content"
              multiline
              rows={6}
              value={formData.content}
              onChange={handleChange}
            />
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
              >
                {loading ? "Saving..." : post ? "Update" : "Create"}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => router.push("/posts")}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
