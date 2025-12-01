// /Users/goldlabel/GitHub/core/gl-core/components/nav/SharePopup.tsx
'use client';

import * as React from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterShareButton,
} from 'react-share';
import {
  Tooltip,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { MightyButton } from '../../../gl-core';
import { Icon } from '../../cartridges/DesignSystem';

export type TFrontmatter = {
  title?: string;
  description?: string;
};

export type TSharePopup = {
  frontmatter?: TFrontmatter;
  [key: string]: unknown;
};

export default function SharePopup({ frontmatter }: TSharePopup) {
  const [copied, setCopied] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { title, description } = frontmatter ?? {};
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const fullWidth: React.CSSProperties = { display: 'block' };

  return (
    <Tooltip title="Share" arrow>
      <>
        <MightyButton
          mode="icon"
          label="Share"
          icon="share"
          color="primary"
          onClick={handleShareClick as any}
        />

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            sx={{ minWidth: 200 }}
            onClick={() => {
              if (navigator?.clipboard?.writeText) {
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
              handleClose();
            }}
          >
            <ListItemIcon>
              <Icon icon="copy" color="primary" />
            </ListItemIcon>
            <ListItemText primary={copied ? 'Copied!' : 'Copy Link'} />
          </MenuItem>

          <MenuItem sx={{ p: 0 }} onClick={handleClose}>
            <FacebookShareButton url={url} style={fullWidth}>
              <Box display="flex" alignItems="center" px={2} py={1}>
                <ListItemIcon>
                  <Icon icon="facebook" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Facebook" />
              </Box>
            </FacebookShareButton>
          </MenuItem>

          <MenuItem sx={{ p: 0 }} onClick={handleClose}>
            <TwitterShareButton title={title} url={url}>
              <Box display="flex" alignItems="center" px={2} py={1}>
                <ListItemIcon>
                  <Icon icon="twitter" color="primary" />
                </ListItemIcon>
                <ListItemText primary="Twitter (X)" />
              </Box>
            </TwitterShareButton>
          </MenuItem>

          <MenuItem sx={{ p: 0 }} onClick={handleClose}>
            <LinkedinShareButton
              url={url}
              title={title}
              summary={description}
              source="Goldlabel"
              style={fullWidth}
            >
              <Box display="flex" alignItems="center" px={2} py={1}>
                <ListItemIcon>
                  <Icon icon="linkedin" color="primary" />
                </ListItemIcon>
                <ListItemText primary="LinkedIn" />
              </Box>
            </LinkedinShareButton>
          </MenuItem>

          <MenuItem sx={{ p: 0 }} onClick={handleClose}>
            <WhatsappShareButton
              url={url}
              title={title}
              separator=" - "
              style={fullWidth}
            >
              <Box display="flex" alignItems="center" px={2} py={1}>
                <ListItemIcon>
                  <Icon icon="whatsapp" color="primary" />
                </ListItemIcon>
                <ListItemText primary="WhatsApp" />
              </Box>
            </WhatsappShareButton>
          </MenuItem>
        </Menu>
      </>
    </Tooltip>
  );
}
